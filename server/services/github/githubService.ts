import { getOctokit } from "./octokitClient";
import {
  OrgInfo,
  AssignmentInfo,
  RepoInfo,
  CommitInfo,
  CompareCommitsInfo,
  AssignmentClassroomInfo,
} from "@shared/githubInterfaces";

export async function getOrganizations(): Promise<OrgInfo[]> {
  const octokit = await getOctokit();
  const response = await octokit.rest.orgs.listForAuthenticatedUser();
  return response.data.map(
    (org): OrgInfo => ({
      id: org.id,
      name: org.login,
      description: org.description,
      avatarUrl: org.avatar_url,
    })
  );
}

export async function getOrganizationIdByName(orgName: string) {
  const octokit = await getOctokit();
  const response = await octokit.rest.orgs.get({ org: orgName });
  return response.data.id;
}

export async function getOrganization(orgName: string): Promise<OrgInfo> {
  const octokit = await getOctokit();

  const { data: org } = await octokit.rest.orgs.get({ org: orgName });

  return {
    id: org.id,
    name: org.login,
    description: org.description,
    avatarUrl: org.avatar_url,
  };
}

export async function getListOfAssignments(
  org: string
): Promise<AssignmentInfo[]> {
  const octokit = await getOctokit();
  const repos = await octokit.rest.repos.listForOrg({
    org: org,
    type: "all",
    per_page: 100,
  });

  console.log(
    "repos from octokit:",
    repos.data.map((r) => r.name)
  );

  const assignmentMap = new Map<string, AssignmentInfo>();

  for (const repo of repos.data) {
    const name = repo.name;

    // Skip if it's marked as a template
    if (repo.is_template) {
      console.log(`Skipping template repo: ${name}`);
      continue;
    }

    // Extract student-suffix pattern (must be at least 2 segments)
    const parts = name.split("-");
    if (parts.length > 2) {
      // Consider everything except the last part as the base name
      const possibleBase = parts.slice(0, -1).join("-");

      // If base repo exists and last part resembles a username (e.g., contains no 'assignment')
      if (repos.data.find((r) => r.name === possibleBase)) {
        console.log(`Skipping student repo: ${name}`);
        continue;
      }
    }

    const baseName = name;
    const updatedAt = repo.updated_at;
    const assignment = assignmentMap.get(baseName);

    if (!assignment) {
      assignmentMap.set(baseName, {
        id: repo.id,
        name: baseName,
        amountOfStudents: 1,
        updatedAt: updatedAt ?? "",
      });
    } else {
      assignment.amountOfStudents++;
      if (
        updatedAt &&
        (!assignment.updatedAt ||
          new Date(updatedAt) > new Date(assignment.updatedAt))
      ) {
        assignment.updatedAt = updatedAt;
      }
    }
  }

  console.log("assignments list returns to frontend :", assignmentMap);

  return Array.from(assignmentMap.values());
}

export async function getAssignmentClassroomInfo(
  org: string
): Promise<AssignmentClassroomInfo[]> {
  const octokit = await getOctokit();

  // find classroom that matches our org
  const { data: classrooms } = await octokit.request("GET /classrooms", {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  // match the organization name to the classroom name
  const matchedClassroom = classrooms.find((c: any) => c.name.startsWith(org));

  if (!matchedClassroom) {
    throw new Error(`No classroom found for organization: ${org}`);
  }

  const classroomId = matchedClassroom.id;

  // get all assignments for that classroom
  const { data: assignments } = await octokit.request(
    "GET /classrooms/{classroom_id}/assignments",
    {
      classroom_id: classroomId,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const detailedAssignments: AssignmentClassroomInfo[] = assignments.map(
    (assignment: any) => ({
      id: assignment.id,
      name: assignment.title ?? "Untitled Assignment",
      accepted: assignment.accepted ?? 0,
      submitted: assignment.submitted ?? 0, // problem with retrieving submission values
      passing: assignment.passing ?? 0,
      deadline: assignment.deadline ? new Date(assignment.deadline) : null,
    })
  );

  return detailedAssignments;
}

export async function getStudentReposForAssignment(
  org: string,
  assignmentPrefix?: string
): Promise<RepoInfo[]> {
  console.log(
    `Searching for repositories ${
      assignmentPrefix ? `with prefix '${assignmentPrefix}' ` : ""
    }under organization ${org}...`
  );
  const repositories: any[] = [];
  const iterator = await buildSearchQuery(org, assignmentPrefix);

  for await (const { data: reposPage } of iterator) {
    const relevantRepos = reposPage.filter((repo) => {
      const isFork = repo.fork === true;
      const nameMatches =
        !assignmentPrefix ||
        repo.name.toLowerCase().startsWith(assignmentPrefix.toLowerCase());
      const isNotBaseAssignment =
        repo.name.toLowerCase() !== assignmentPrefix?.toLowerCase(); // <-- Prevent showing the base assignment repo

      return isFork && nameMatches && isNotBaseAssignment;
    });

    const detailPromises = relevantRepos.map((repo) =>
      extractRepositoryDetails(org, repo)
    );

    const detailResults = await Promise.allSettled(detailPromises);

    detailResults.forEach((result) => {
      if (result.status === "fulfilled") {
        repositories.push(result.value);
      } else {
        console.warn("Repo detail fetch failed:", result.reason);
      }
    });
  }
  console.log(`Found ${repositories.length} matching repositories.`);
  return repositories;
}

async function buildSearchQuery(org: string, assignmentPrefix?: string) {
  const octokit = await getOctokit();
  const query =
    `fork:true org:${org}` +
    (assignmentPrefix ? ` ${assignmentPrefix} in:name` : "");

  return octokit.paginate.iterator(octokit.rest.search.repos, {
    q: query,
    per_page: 100,
  });
}

async function extractRepositoryDetails(org: string, repo: any) {
  const octokit = await getOctokit();
  const lastCommit = await octokit.rest.repos.getCommit({
    owner: org,
    repo: repo.name,
    ref: repo.default_branch,
  });

  return {
    id: repo.node_id,
    name: repo.name,
    owner: repo.owner?.login || "unknown",
    avatarUrl: repo.owner?.avatar_url ?? "",
    url: repo.html_url,
    description: repo.description ?? undefined,
    defaultBranch: repo.default_branch,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    lastPush: repo.pushed_at,
    lastCommitMessage: lastCommit.data.commit.message,
    lastCommitDate: lastCommit.data.commit.committer?.date,
    collaborators: await getRepoCollaborators(org, repo.name),
  };
}

async function getRepoCollaborators(org: string, repo: string) {
  const octokit = await getOctokit();
  try {
    const response = await octokit.rest.repos.listCollaborators({
      owner: org,
      repo,
      affiliation: "direct",
    });

    return response.data.map((user) => ({
      id: user.id,
      name: user.login,
      avatarUrl: user.avatar_url,
      htmlUrl: user.html_url,
      permissions: {
        admin: user.permissions?.admin ?? false,
        maintain: user.permissions?.maintain ?? false,
        push: user.permissions?.push ?? false,
        triage: user.permissions?.triage ?? false,
        pull: user.permissions?.pull ?? false,
      },
    }));
  } catch (error: any) {
    console.error(`Error fetching collaborators for ${repo}:`, error.message);
    return [];
  }
}

export async function getCommits(
  orgName: string,
  repoName: string
): Promise<CommitInfo[]> {
  const octokit = await getOctokit();
  const response = await octokit.rest.repos.listCommits({
    owner: orgName,
    repo: repoName,
    per_page: 100,
  });

  return response.data.map((commit: any) => ({
    sha: commit.sha,
    html_url: commit.html_url,
    commit: {
      message: commit.commit.message,
      author: {
        name: commit.commit.author?.name ?? "",
        email: commit.commit.author?.email ?? "",
        date: commit.commit.author?.date ?? "",
      },
    },
    author: commit.author
      ? {
          login: commit.author.login,
          avatar_url: commit.author.avatar_url,
          html_url: commit.author.html_url,
        }
      : null,
  }));
}

export async function getRepoTree(
  orgName: string,
  repoName: string
): Promise<string[]> {
  const octokit = await getOctokit();
  const { data: refData } = await octokit.rest.git.getRef({
    owner: orgName,
    repo: repoName,
    ref: "heads/main",
  });

  const { data: treeData } = await octokit.rest.git.getTree({
    owner: orgName,
    repo: repoName,
    tree_sha: refData.object.sha,
    recursive: "true",
  });

  return treeData.tree
    .filter((item: any) => item.type === "blob" && item.path)
    .map((item: any) => item.path!);
}

export async function getFileContents(
  orgName: string,
  repoName: string,
  path: string
): Promise<string | null> {
  const octokit = await getOctokit();
  try {
    const response = await octokit.rest.repos.getContent({
      owner: orgName,
      repo: repoName,
      path,
    });

    if ("content" in response.data) {
      return Buffer.from(response.data.content, "base64").toString("utf-8");
    }
    return null;
  } catch (error) {
    console.error(`Error fetching file ${path}:`, error);
    return null;
  }
}

export async function compareCommits(
  orgName: string,
  repoName: string,
  base: string,
  head: string
): Promise<CompareCommitsInfo> {
  const octokit = await getOctokit();
  const response = await octokit.rest.repos.compareCommits({
    owner: orgName,
    repo: repoName,
    base,
    head,
  });

  return {
    status: response.data.status ?? "",
    ahead_by: response.data.ahead_by ?? 0,
    behind_by: response.data.behind_by ?? 0,
    total_commits: response.data.total_commits ?? 0,
    commits: response.data.commits.map((commit: any) => ({
      sha: commit.sha,
      html_url: commit.html_url,
      commit: {
        message: commit.commit.message,
        author: {
          name: commit.commit.author?.name ?? "",
          email: commit.commit.author?.email ?? "",
          date: commit.commit.author?.date ?? "",
        },
      },
      author: commit.author
        ? {
            login: commit.author.login,
            avatar_url: commit.author.avatar_url,
            html_url: commit.author.html_url,
          }
        : null,
    })),
    files:
      response.data.files?.map((file: any) => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
      })) ?? [],
  };
}

export async function getParentRepoId(orgName: string, repoName: string) {
  const octokit = await getOctokit();

  try {
    const { data } = await octokit.repos.get({
      owner: orgName,
      repo: repoName,
    });

    return data.parent?.id ?? null;
  } catch (error: any) {
    console.error(`GitHub API error while fetching repo ${repoName}:`, error);
    return null;
  }
}
