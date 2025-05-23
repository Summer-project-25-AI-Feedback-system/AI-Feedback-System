import { promises } from "dns";
import { octokit } from "./octokitClient";
import { OrgInfo, AssignmentInfo, RepoInfo } from "@shared/githubInterfaces";

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
    const updatedAt = repo.updated_at ?? undefined;

    const assignment = assignmentMap.get(baseName);

    if (!assignment) {
      assignmentMap.set(baseName, {
        name: baseName,
        submissionCount: 1,
        lastUpdated: updatedAt,
      });
    } else {
      assignment.submissionCount++;
      if (
        updatedAt &&
        (!assignment.lastUpdated ||
          new Date(updatedAt) > new Date(assignment.lastUpdated))
      ) {
        assignment.lastUpdated = updatedAt;
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
    avatarUrl: repo.owner?.avatar_url ?? null,
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
      id: user.id,
      name: user.login,
      avatarUrl: user.avatar_url,
      htmlUrl: user.html_url,
      permissions: user.permissions,
    }));
  } catch (error: any) {
    console.error(`Error fetching collaborators for ${repo}:`, error.message);
    return [];
  }
}

export async function getFileContents(
  owner: string,
  repo: string,
  filePaths: string[]
): Promise<Record<string, string | null>> {
  const contents: Record<string, string | null> = {};
  console.log(`\nFetching files from repository ${owner}/${repo}:`);

  for (const filePath of filePaths) {
    try {
      const response = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: filePath,
      });

      if (
        response.data &&
        !Array.isArray(response.data) &&
        response.data.type === "file" &&
        response.data.content
      ) {
        const content = Buffer.from(response.data.content, "base64").toString(
          "utf-8"
        );
        contents[filePath] = content;
        console.log(` - ${filePath}: Downloaded (${content.length} bytes)`);
      } else {
        console.log(
          ` - ${filePath}: Path found, but it's not a file or content is missing.`
        );
        contents[filePath] = null;
      }
    } catch (error: any) {
      if (error.status === 404) {
        console.log(` - ${filePath}: Not found.`);
      } else {
        console.error(
          ` - Error fetching file ${filePath} from ${owner}/${repo}: ${error.status} ${error.message}`
        );
      }
      contents[filePath] = null;
    }
  }

  return contents;
}

export async function getRepositoryFileTree(owner: string, repo: string) {
  const { data: refData } = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: "heads/main", // or use repo.default_branch if dynamic
  });
  console.log();

  const { data: treeData } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: refData.object.sha,
    recursive: "true",
  });
  console.log(treeData);

  return treeData.tree
    .filter((item) => item.type === "blob") // Only files
    .map((item) => item.path);
}
export async function getRepos(org: string): Promise<any[]> {
  const repos = await octokit.rest.repos.listForOrg({
    org,
    type: "all",
    per_page: 100,
  });

  return repos.data;
}