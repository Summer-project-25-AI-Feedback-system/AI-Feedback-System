import { Request, Response } from "express";
import {
  getAssignmentRepositories,
  getOrganizations,
  getFileContents,
} from "../services/github/githubService";

export async function handleGetOrganizations(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const orgs = await getOrganizations();
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch organizations" });
  }
}

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
    const repos = await getAssignmentRepositories(org, assignmentPrefix);
    res.json(repos);
  } catch (error) {
    console.error("Failed to fetch student repos:", error);
    res.status(500).json({ error: "Failed to fetch student repos" });
  }
}

export async function handleGetFileContents(
  req: Request,
  res: Response
): Promise<void> {
  const { owner, repo, files } = req.body;

  if (!owner || !repo || !Array.isArray(files)) {
    res
      .status(400)
      .json({ error: "Missing required parameters: owner, repo, files[]" });
    return;
  }

  try {
    const contents = await getFileContents(owner, repo, files);
    res.json(contents);
  } catch (error) {
    console.error("Failed to fetch file contents:", error);
    res.status(500).json({ error: "Failed to fetch file contents" });
  }
}
