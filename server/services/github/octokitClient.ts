// import { Octokit } from "@octokit/rest"; not allowed in CommonJS
import dotenv from "dotenv";
dotenv.config();

export const getOctokit = async () => {
  const { Octokit } = await import("@octokit/rest");
  return new Octokit({
    auth: process.env.GITHUB_PAT,
  });
};