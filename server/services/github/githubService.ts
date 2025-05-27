import { promises } from "dns";
import { octokit } from "./octokitClient";
import {
  OrgInfo,
  AssignmentInfo,
  RepoInfo,
  CommitInfo,
  CompareCommitsInfo,
} from "@shared/githubInterfaces";

export async function getOrganizations(): Promise<OrgInfo[]> {
  const response = await octokit.rest.orgs.listForAuthenticatedUser();
  return response.data.map(
    (org): OrgInfo => ({
      name: org.login,
      description: org.description,
      avatarUrl: org.avatar_url,
    })
  );
}

export async function getAssignments(org: string): Promise<AssignmentInfo[]> {
  const repos = await octokit.rest.repos.listForOrg({
    org: org,
    type: "all",
    per_page: 100,
  });

  const assignmentMap = new Map<string, AssignmentInfo>();

  repos.data.forEach((repo) => {
    const baseName = repo.name.replace(/-[a-z0-9]+$/i, "");
    const updatedAt = repo.updated_at;

    const assignment = assignmentMap.get(baseName);

    if (!assignment) {
      assignmentMap.set(baseName, {
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
  });

  return Array.from(assignmentMap.values());
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
    const relevantRepos = reposPage.filter(
      (repo) =>
        !assignmentPrefix ||
        repo.name.toLowerCase().includes(assignmentPrefix.toLowerCase())
    );

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
  const query =
    `fork:true org:${org}` +
    (assignmentPrefix ? ` ${assignmentPrefix} in:name` : "");

  return octokit.paginate.iterator(octokit.rest.search.repos, {
    q: query,
    per_page: 100,
  });
}

async function extractRepositoryDetails(org: string, repo: any) {
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

// export async function getFileContents(
//   owner: string,
//   repo: string,
//   filePaths: string[]
// ): Promise<Record<string, string | null>> {
//   const contents: Record<string, string | null> = {};
//   console.log(`\nFetching files from repository ${owner}/${repo}:`);

//   for (const filePath of filePaths) {
//     try {
//       const response = await octokit.rest.repos.getContent({
//         owner,
//         repo,
//         path: filePath,
//       });

//       if (
//         response.data &&
//         !Array.isArray(response.data) &&
//         response.data.type === "file" &&
//         response.data.content
//       ) {
//         const content = Buffer.from(response.data.content, "base64").toString(
//           "utf-8"
//         );
//         contents[filePath] = content;
//         console.log(` - ${filePath}: Downloaded (${content.length} bytes)`);
//       } else {
//         console.log(
//           ` - ${filePath}: Path found, but it's not a file or content is missing.`
//         );
//         contents[filePath] = null;
//       }
//     } catch (error: any) {
//       if (error.status === 404) {
//         console.log(` - ${filePath}: Not found.`);
//       } else {
//         console.error(
//           ` - Error fetching file ${filePath} from ${owner}/${repo}: ${error.status} ${error.message}`
//         );
//       }
//       contents[filePath] = null;
//     }
//   }

//   return contents;
// }

export async function getCommits(
  orgName: string,
  repoName: string
): Promise<CommitInfo[]> {
  const response = await octokit.rest.repos.listCommits({
    owner: orgName,
    repo: repoName,
    per_page: 100,
  });

  return response.data.map((commit) => ({
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
    .filter((item) => item.type === "blob" && item.path)
    .map((item) => item.path!);
}

export async function getFileContents(
  orgName: string,
  repoName: string,
  path: string
): Promise<string | null> {
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
    commits: response.data.commits.map((commit) => ({
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
      response.data.files?.map((file) => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
      })) ?? [],
  };
}
export async function getRepos(org: string): Promise<any[]> {
  const repos = await octokit.rest.repos.listForOrg({
    org,
    type: "all",
    per_page: 100,
  });

  return repos.data;
}