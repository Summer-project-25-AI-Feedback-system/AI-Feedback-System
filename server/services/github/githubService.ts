import { getOctokit } from "./octokitClient";
import {
  Collaborator,
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

  if (!response) {
    throw new Error(`Error fetching organizations`);
  }

  const { data: classrooms } = await octokit.request("GET /classrooms", {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!classrooms) {
    throw new Error(`Error fetching classrooms`);
  }

  const filteredOrgs: OrgInfo[] = [];

  for (const org of response.data) {
    const hasClassroom = classrooms.find((c: any) =>
      c.name.startsWith(org.login)
    );
    if (hasClassroom) {
      filteredOrgs.push({
        id: org.id,
        name: org.login,
        description: org.description,
        avatarUrl: org.avatar_url,
      });
    }
  }

  return filteredOrgs;
}

export async function getOrganizationIdByName(orgName: string) {
  const octokit = await getOctokit();
  const response = await octokit.rest.orgs.get({ org: orgName });
  return response.data.id;
}

export async function getOrganization(orgName: string): Promise<OrgInfo> {
  const octokit = await getOctokit();

  const { data: org } = await octokit.rest.orgs.get({ org: orgName });

  if (!org) {
    throw new Error(`Error fetching organization`);
  }

  const { data: classrooms } = await octokit.request("GET /classrooms", {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!classrooms) {
    throw new Error(`Error fetching classrooms`);
  }

  const hasClassroom = classrooms.find((c: any) =>
    c.name.startsWith(org.login)
  );

  if (!hasClassroom) {
    throw new Error(`No classroom found for organization: ${org.login}`);
  }

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

  // Find the classroom that corresponds to the organization name
  const { data: classrooms } = await octokit.request("GET /classrooms", {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const matchedClassroom = classrooms.find((c: any) => c.name.startsWith(org));

  if (!matchedClassroom) {
    console.warn(`No classroom found for organization: ${org}`);
    return [];
  }

  const classroomId = matchedClassroom.id;

  // Get all assignments for that classroom using the dedicated API endpoint
  const { data: assignments } = await octokit.request(
    "GET /classrooms/{classroom_id}/assignments",
    {
      classroom_id: classroomId,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  console.log(
    `Found ${assignments.length} assignments for classroom ID ${classroomId}.`
  );
  console.log(
    "Assignments from Classroom API:",
    assignments.map((a: any) => a.title)
  );

  const assignmentInfoPromises = assignments.map(async (assignment: any) => {
    // For each assignment, get the list of accepted student repos
    const { data: acceptedAssignments } = await octokit.request(
      "GET /assignments/{assignment_id}/accepted_assignments",
      {
        assignment_id: assignment.id,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    let mostRecentUpdate: string | null = assignment.updated_at;

    // Iterate through all student repos to find the most recent commit date
    for (const acceptedAssignment of acceptedAssignments) {
      try {
        const repoName = acceptedAssignment.repository.full_name.split("/")[1];
        const lastCommit = await octokit.rest.repos.listCommits({
          owner: org,
          repo: repoName,
          per_page: 1,
        });

        if (lastCommit.data.length > 0) {
          const commitDate = lastCommit.data[0].commit.author?.date;
          if (
            commitDate &&
            (!mostRecentUpdate ||
              new Date(commitDate) > new Date(mostRecentUpdate))
          ) {
            mostRecentUpdate = commitDate;
          }
        }
      } catch (error) {
        console.error(
          `Error fetching commits for repo ${acceptedAssignment.repository.full_name}:`,
          error
        );
      }
    }

    return {
      id: assignment.id,
      name: assignment.title ?? "Untitled Assignment",
      amountOfStudents: acceptedAssignments.length,
      updatedAt: mostRecentUpdate ?? "",
    };
  });

  const assignmentsWithStudents = await Promise.all(assignmentInfoPromises);

  console.log(
    "Refactored assignments list returns to frontend:",
    assignmentsWithStudents
  );

  return assignmentsWithStudents;
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
  assignmentName?: string
): Promise<RepoInfo[]> {
  const octokit = await getOctokit();
  console.log(
    `Fetching student repositories for assignment: ${assignmentName} under organization: ${org}...`
  );

  try {
    // 1. Find the classroom that corresponds to the organization
    const { data: classrooms } = await octokit.request("GET /classrooms", {
      headers: { "X-GitHub-Api-Version": "2022-11-28" },
    });

    const matchedClassroom = classrooms.find((c: any) =>
      c.name.startsWith(org)
    );
    if (!matchedClassroom) {
      console.warn(`No classroom found for organization: ${org}`);
      return [];
    }
    const classroomId = matchedClassroom.id;

    // 2. Find the specific assignment by its name (title)
    const { data: assignments } = await octokit.request(
      "GET /classrooms/{classroom_id}/assignments",
      {
        classroom_id: classroomId,
        headers: { "X-GitHub-Api-Version": "2022-11-28" },
      }
    );
    const matchedAssignment = assignments.find(
      (a: any) => a.title === assignmentName
    );
    if (!matchedAssignment) {
      console.warn(
        `No assignment with the name "${assignmentName}" found in classroom.`
      );
      return [];
    }
    const assignmentId = matchedAssignment.id;

    // 3. Use the assignment ID to fetch all accepted student repositories
    const { data: acceptedAssignments } = await octokit.request(
      "GET /assignments/{assignment_id}/accepted_assignments",
      {
        assignment_id: assignmentId,
        headers: { "X-GitHub-Api-Version": "2022-11-28" },
      }
    );

    console.log(`Found ${acceptedAssignments.length} accepted repositories.`);

    // 4. Extract repository details, including the latest commit
    const detailPromises = acceptedAssignments.map(
      async (acceptedAssignment: any) => {
        const repo = acceptedAssignment.repository;

        const { data: fullRepoData } = await octokit.rest.repos.get({
          owner: org,
          repo: repo.name,
        });

        // ✅ Use the owner from the full repo data, as it's guaranteed to be correct
        const owner = fullRepoData.owner?.login || "unknown";

        // Fetch the list of collaborators
        const collaborators = await getRepoCollaborators(org, repo.name);

        let lastCommitMessage;
        let lastCommitDate;
        try {
          const lastCommit = await octokit.rest.repos.listCommits({
            owner: org,
            repo: repo.name,
            per_page: 1,
          });

          if (lastCommit.data.length > 0) {
            lastCommitMessage = lastCommit.data[0].commit.message;
            lastCommitDate = lastCommit.data[0].commit.author?.date;
          }
        } catch (error) {
          console.warn(
            `Could not fetch last commit for repo ${repo.name}:`,
            error
          );
        }

        // Construct and return the RepoInfo object
        return {
          id: repo.node_id,
          name: repo.name,
          owner: repo.owner?.login || "unknown",
          avatarUrl: repo.owner?.avatar_url ?? "",
          url: repo.html_url,
          description: repo.description ?? undefined,
          defaultBranch: repo.default_branch,
          createdAt: fullRepoData.created_at, // ✅ Correct date from full API response
          updatedAt: fullRepoData.updated_at, // ✅ Correct date from full API response
          lastPush: repo.pushed_at,
          lastCommitMessage,
          lastCommitDate,
          collaborators,
        };
      }
    );

    const repositories = await Promise.all(detailPromises);
    return repositories;
  } catch (error) {
    console.error(`Error fetching student repositories:`, error);
    return [];
  }
}

async function getRepoCollaborators(
  org: string,
  repo: string
): Promise<Collaborator[]> {
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

  try {
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
  } catch (error) {
    console.error(`Failed to fetch commits: ${error}`);
    throw error;
  }
}

export async function getRepoTree(
  orgName: string,
  repoName: string
): Promise<string[]> {
  const octokit = await getOctokit();

  try {
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
  } catch (error) {
    console.error(`Failed to fetch repository tree: ${error}`);
    throw error;
  }
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
  try {
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
  } catch (error) {
    console.error(`Error comparing commits:`, error);
    throw error;
  }
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
