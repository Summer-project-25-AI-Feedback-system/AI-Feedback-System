export const getOctokit = async () => {
  const { Octokit } = await import("@octokit/rest");
  return new Octokit({
    auth: process.env.GITHUB_PAT,
  });
};
