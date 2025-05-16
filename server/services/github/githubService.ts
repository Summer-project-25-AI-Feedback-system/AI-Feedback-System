import { octokit } from "./octokitClient";
import { OrgInfo, AssignmentInfo } from "@shared/github";

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

export async function getAssignments(
  orgLogin: string
): Promise<AssignmentInfo[]> {
  const repos = await octokit.rest.repos.listForOrg({
    org: orgLogin,
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

export async function getAssignmentRepositories(
  org: string,
  assignmentPrefix?: string
) {
  console.log(
    `Searching for repositories ${
      assignmentPrefix ? `with prefix '${assignmentPrefix}' ` : ""
    }under organization ${org}...`
  );
  const repositories: any[] = [];
  const iterator = await buildSearchQuery(org, assignmentPrefix);

  for await (const { data: reposPage } of iterator) {
    for (const repo of reposPage) {
      if (
        !assignmentPrefix ||
        repo.name.toLowerCase().includes(assignmentPrefix.toLowerCase())
      ) {
        const details = await extractRepositoryDetails(org, repo);
        repositories.push(details);
      }
    }
  }
  console.log(`Found ${repositories.length} matching repositories.`);
  return repositories;
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
