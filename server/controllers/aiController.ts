import { Request, Response } from "express";
import { runRepomix, runAIEvolution } from "../services/ai/aiService";

export async function handleRunRepomix(
  req: Request,
  res: Response
): Promise<void> {
  const { repoUrl } = req.body;

  if (!repoUrl) {
    res.status(400).json({ error: "Missing repoUrl" });
    return;
  }

  try {
    const xmlOutput = await runRepomix(repoUrl);
    res.json({ xml: xmlOutput });
  } catch (error) {
    console.error("Repomix error:", error);
    res.status(500).json({ error: "Failed to run repomix" });
  }
}

export async function handleRunAIEvolution(
  req: Request,
  res: Response
): Promise<void> {
  const { xml, organizationId, repoPath } = req.body;

  if (!xml || !organizationId || !repoPath) {
    res.status(400).json({ error: "Missing xml, organizationId, or repoPath" });
    return;
  }

  try {
    const feedback = await runAIEvolution(xml, organizationId, repoPath);
    res.json({ feedback });
  } catch (error) {
    console.error("AIEvolution error:", error);
    res.status(500).json({ error: "Failed to run AIEvolution" });
  }
}
