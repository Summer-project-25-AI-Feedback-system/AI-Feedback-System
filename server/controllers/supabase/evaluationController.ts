import { Request, Response } from "express";
import {
  fetchEvaluations,
  createOrUpdateEvaluations,
  checkEvaluationExistsService,
} from "../../services/supabase/evaluationService";
import type { AiEvaluationInput } from "../../../shared/supabaseInterfaces";
import { GithubReqBody } from "../../../shared/supabaseInterfaces";

export const getEvaluations = async (req: Request, res: Response) => {
  const organizationId = (req as any).organizationId;
  const { github_assignment_id, roster_student_id } = req.query; // the assignment ID if from github, the roster ID is from supabase!

  try {
    const feedback = await fetchEvaluations(
      organizationId,
      github_assignment_id as string | undefined,
      roster_student_id as string | undefined
    );

    if (!feedback || feedback.length === 0) {
      res.status(204).send();
      return;
    }

    res.status(200).json(feedback);
  } catch (error: any) {
    console.error("Error fetching evaluations:", error);
    res.status(500).json({
      error: "Unexpected server error while retrieving assignment evaluations",
    });
  }
};

// TODO: is this still needed or working since the service function was completely changed for Ville's command prompt? is this needed in the frontend at all?
export const addEvaluations = async (req: Request, res: Response) => {
  const organizationId = (req as any).organizationId;
  const body = req.body;
  console.log("organizationId:", organizationId);
  console.log("body:", body);
  try {
    await createOrUpdateEvaluations(organizationId, body);
    res.status(200).send("Evaluation(s) created or updated");
  } catch (error: any) {
    if (error.status === 404) {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error("Unexpected error storing evaluation(s):", error);
    res.status(500).json({ error: "Failed to store evaluation(s)" });
  }
};

export async function checkEvaluationExists(req: Request, res: Response) {
  const {
    githubUsername,
    orgName,
    orgId,
    repoName,
    assignmentName,
  }: GithubReqBody = req.body;

  try {
    const result = await checkEvaluationExistsService({
      githubUsername,
      orgName,
      orgId,
      repoName,
      assignmentName,
    });

    res.status(200).json(result); // returns { exists: true | false }
  } catch (err: any) {
    console.error("Check evaluation error:", err.message);
    if (
      err.message.includes("Organization not found") ||
      err.message.includes("Parent repo not found") ||
      err.message.includes("Assignment not found") ||
      err.message.includes("Student not found")
    ) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export async function addSelfEvaluation(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { organizationUuId, assignmentUuId, rosterStudentUuId, feedback } = (
      req as any
    ).evaluationData;

    const evaluationData: any = {
      roster_student_id: rosterStudentUuId,
      assignment_id: assignmentUuId,
      organization_id: organizationUuId,
      created_at: new Date(),
      ai_model: "gpt-4",
      md_file: feedback,
    };
    console.log("evaluationData:", evaluationData);

    await createOrUpdateEvaluations(organizationUuId, evaluationData);
    res.status(200).send("Self-Evaluation created by student.");
  } catch (error) {
    console.error("Error creating self-evaluation:", error);
    res.status(500).json({ error: "Failed to store evaluation" });
  }
}
