import axios from "axios";

const GITHUB_ORG = process.env.GITHUB_ORG!;
const GITHUB_PAT = process.env.GITHUB_PAT!;

const github = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `Bearer ${GITHUB_PAT}`,
    Accept: "application/vnd.github.v3+json",
  },
});

export async function getStudentRepos() {
  try {
    const response = await github.get(`/orgs/${GITHUB_ORG}/repos`, {
      params: { per_page: 100 },
    });

    const repos = response.data;

    // Filter only student assignment repos (optional)
    const studentRepos = repos.filter(
      (repo: any) => repo.name.includes("assignment") // adjust based on your naming pattern
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
