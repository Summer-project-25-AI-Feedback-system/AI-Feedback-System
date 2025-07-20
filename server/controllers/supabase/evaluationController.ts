import { Request, Response } from "express";
import {
  fetchEvaluations,
  createOrUpdateEvaluations,
} from "../../services/supabase/evaluationService";
import { fetchRosterStudentId } from "../../services/supabase/rosterService";
import { getParentRepoId } from "../../services/github/githubService";
import type {
  GithubReqBody,
  AiEvaluationInput,
} from "../../../shared/supabaseInterfaces";

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

export async function addSelfEvaluation(
  req: Request,
  res: Response
): Promise<void> {
  const organizationUuId = (req as any).organizationId;
  const body: GithubReqBody = req.body;
  console.log("organizationId:", organizationUuId);
  console.log("body:", body);
  const { githubUsername, orgName, repoName, feedback } = req.body;

  if (!githubUsername || !orgName || !repoName) {
    res
      .status(400)
      .json({ error: "Missing parameters to add self evaluation" });
    return;
  }

  try {
    // Directly call the service function
    const rosterStudentId = await fetchRosterStudentId(githubUsername);

    if (!rosterStudentId) {
      res.status(404).json({ error: "Student not found." });
      return;
    }
    const parentRepoId = (await getParentRepoId(orgName, repoName))?.toString();

    if (!parentRepoId) {
      res.status(404).json({ error: "Parent repository not found." });
      return;
    }

    // Now create the evaluation with the rosterStudentId
    const evaluationData: AiEvaluationInput = {
      roster_student_id: rosterStudentId,
      assignment_id: parentRepoId,
      organization_id: organizationUuId,
      created_at: new Date(),
      ai_model: "gpt-4",
      md_file: feedback,
    };

    await createOrUpdateEvaluations(organizationUuId, evaluationData);
    res.status(200).send("Self-Evaluation created by student.");
  } catch (error) {
    console.error("Error creating self-evaluation:", error);
    res.status(500).json({ error: "Failed to store evaluation" });
  }
  // try {
  //   await handleAddSelfEvaluation(organizationId, body);
  //   res.status(200).send("Self-Evaluation created by student.");
  // } catch (error) {
  //   res.status(500).json({ error: "Failed to store evaluation(s)" });
  // }
}
