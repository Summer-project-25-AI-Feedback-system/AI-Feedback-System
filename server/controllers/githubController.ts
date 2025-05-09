import { Request, Response } from "express";
import { findAssignmentRepositories } from "../services/githubChecker";

export async function handleGetStudentRepos(
  req: Request,
  res: Response
): Promise<void> {
  const org = req.query.org as string;
  const assignmentPrefix = req.query.assignmentPrefix as string;

  if (!org || !assignmentPrefix) {
    res
      .status(400)
      .json({ error: "Organization or Assignment Prefix not specified" });
    return;
  }

  try {
    const repos = await findAssignmentRepositories(org, assignmentPrefix);
    res.json(repos);
  } catch (error) {
    console.error("Failed to fetch student repos:", error);
    res.status(500).json({ error: "Failed to fetch student repos" });
  }
}
