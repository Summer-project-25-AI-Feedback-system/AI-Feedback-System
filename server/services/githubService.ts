// services/githubChecker.ts
import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

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

export async function findAssignmentRepositories(
  org: string,
  assignmentPrefix: string
) {
  const ownerIdentifier = `organization ${org}`;

  console.log(
    `Searching for repositories with prefix '${assignmentPrefix}' under ${ownerIdentifier}...`
  );

  const repositories: any[] = [];
  let query = `fork:true ${assignmentPrefix} in:name`;

  query += ` org:${org}`;

  try {
    const iterator = octokit.paginate.iterator(octokit.rest.search.repos, {
      q: query,
      per_page: 100,
    });

    for await (const { data: reposPage } of iterator) {
      for (const repo of reposPage) {
        if (
          repo.name
            .toLowerCase()
            .includes((assignmentPrefix || "").toLowerCase())
        ) {
          repositories.push({
            name: repo.name,
            owner: repo.owner?.login || "unknown",
            url: repo.html_url,
            lastPush: repo.pushed_at,
          });
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
      console.error(`Organization/User not found.`);
    } else if (error.status === 403) {
      console.error("Rate limit or scope issue.");
    }
    return [];
  }
}
