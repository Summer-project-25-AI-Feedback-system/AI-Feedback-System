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
    const encoded = Buffer.from(xmlOutput, "utf-8").toString("base64");
    res.json({ xml: encoded });
  } catch (error) {
    console.error("Repomix error:", error);
    res.status(500).json({ error: "Failed to run repomix" });
  }
}

export async function handleRunAIEvolution(
  req: Request,
  res: Response
): Promise<void> {
  const { xml: base64Xml, organizationId, repoPath } = req.body;

  if (!base64Xml || !organizationId || !repoPath) {
    res.status(400).json({ error: "Missing xml, organizationId, or repoPath" });
    return;
  }

  try {
    const xml = Buffer.from(base64Xml, "base64").toString("utf-8");
    const feedback = await runAIEvolution(xml, organizationId, repoPath);
    res.json({ feedback });
  } catch (error) {
    console.error("AIEvolution error:", error);
    res.status(500).json({ error: "Failed to run AIEvolution" });
  }
}
