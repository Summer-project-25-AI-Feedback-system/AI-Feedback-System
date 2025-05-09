import { Request, Response } from "express";
import { getStudentRepos } from "../services/githubChecker";

export async function handleGetStudentRepos(
  req: Request,
  res: Response
): Promise<void> {
  const org = req.query.org as string;

  if (!org) {
    res.status(400).json({ error: "Organization not specified" });
    return;
  }

  try {
    const repos = await getStudentRepos(org);
    res.json(repos);
  } catch (error) {
    console.error("Failed to fetch student repos:", error);
    res.status(500).json({ error: "Failed to fetch student repos" });
  }
}
