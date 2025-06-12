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

  console.log(`Running Repomix for: ${repoUrl}`);

  try {
    const xmlOutput = await runRepomix(repoUrl);
    console.log("Repomix succeeded, sending response");
    res.json({ xml: xmlOutput });
  } catch (error) {
    console.error("Repomix error:", error);
    res
      .status(500)
      .json({
        error: "Failed to run repomix",
        details: (error as Error).message,
      });
  }
}

export async function handleRunAIEvolution(
  req: Request,
  res: Response
): Promise<void> {
  const { xml, organizationId } = req.body;

  if (!xml || !organizationId) {
    res.status(400).json({ error: "Missing xml or organizationId" });
    return;
  }

  try {
    const feedback = await runAIEvolution(xml, organizationId);
    res.json({ feedback });
  } catch (error) {
    console.error("AIEvolution error:", error);
    res.status(500).json({ error: "Failed to run AIEvolution" });
  }
}
