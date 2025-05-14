import { octokit } from "./octokitClient";
import { buildSearchQuery, extractRepositoryDetails } from "./githubHelpers";

export async function getOrganizations() {
  try {
    const response = await octokit.rest.orgs.listForAuthenticatedUser();
    return response.data.map((org) => ({
      login: org.login,
      description: org.description,
      avatarUrl: org.avatar_url,
    }));
  } catch (error: any) {
    console.error("Error fetching organizations:", error.message);
    throw new Error("Failed to fetch organizations");
  }
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

  try {
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
  } catch (error: any) {
    console.error(`Error fetching repositories: ${error.message}`);
    if (error.status === 401) {
      console.error("Authentication failed. Check your GitHub PAT.");
    } else if (error.status === 404) {
      console.error("Organization/User not found.");
    } else if (error.status === 403) {
      console.error("Rate limit or scope issue.");
    }
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
