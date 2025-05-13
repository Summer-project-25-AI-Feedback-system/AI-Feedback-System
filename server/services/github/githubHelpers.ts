import { octokit } from "./octokitClient"; // see suggestion below

export async function buildSearchQuery(org: string, assignmentPrefix?: string) {
  const query =
    `fork:true org:${org}` +
    (assignmentPrefix ? ` ${assignmentPrefix} in:name` : "");

  return octokit.paginate.iterator(octokit.rest.search.repos, {
    q: query,
    per_page: 100,
  });
}

export async function extractRepositoryDetails(org: string, repo: any) {
  const lastCommit = await octokit.rest.repos.getCommit({
    owner: org,
    repo: repo.name,
    ref: repo.default_branch,
  });

  return {
    name: repo.name,
    owner: repo.owner?.login || "unknown",
    url: repo.html_url,
    description: repo.description,
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
      login: user.login,
      id: user.id,
      avatarUrl: user.avatar_url,
      htmlUrl: user.html_url,
      permissions: user.permissions,
    }));
  } catch (error: any) {
    console.error(`Error fetching collaborators for ${repo}:`, error.message);
    return [];
  }
}
