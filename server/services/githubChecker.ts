import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_PAT,
});

export async function getStudentRepos(org: string) {
  try {
    const response = await octokit.rest.repos.listForOrg({
      org, // GitHub organization name
      type: "all", // Can filter by repo type (public, private, forks, etc.)
    });

    const repos = response.data;

    // Filter only student assignment repos (optional)
    const studentRepos = repos.filter(
      (repo: any) => repo.name.includes("assignment") // Adjust according to your repo naming convention
    );

    console.log(studentRepos);

    return studentRepos.map((repo: any) => ({
      name: repo.name,
      url: repo.html_url,
      lastPush: repo.pushed_at,
    }));
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [];
  }
}
