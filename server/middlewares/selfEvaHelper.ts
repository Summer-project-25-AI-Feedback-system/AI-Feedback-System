import { Request, Response, NextFunction } from "express";
import { supabase } from "../utils/supabase";
import { getParentRepoId } from "../services/github/githubService";
import { handleGetAssignmentId } from "../services/supabase/assignmentService";
import { getOrganizationIdByGithubOrgId } from "../services/supabase/organizationService";
import { fetchRosterStudentId } from "../services/supabase/rosterService";
import type { GithubReqBody } from "../../shared/supabaseInterfaces";

export const isEvaluated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { githubUsername, orgName, orgId, repoName, feedback }: GithubReqBody =
    req.body;

  if (!githubUsername || !orgName || !orgId || !repoName || !feedback) {
    res.status(400).json({ error: "Missing parameters for evaluation check" });
    return;
  }

  try {
    const organizationUuId = await getOrganizationIdByGithubOrgId(orgId);

    if (!organizationUuId) {
      res.status(404).json({ error: "Organization not found." });
      return;
    }
    // const parentRepoId = (await getParentRepoId(orgName, repoName))?.toString();
    const parentRepoId = (await getParentRepoId(orgName, repoName))?.toString();

    if (!parentRepoId) {
      res.status(404).json({ error: "Parent repository not found." });
      return;
    }

    const assignmentUuId = await handleGetAssignmentId(
      organizationUuId,
      parentRepoId
    );
    if (!assignmentUuId) {
      res.status(404).json({ error: "Assignment not found." });
      return;
    }
    const rosterStudentUuId = await fetchRosterStudentId(githubUsername);

    if (!rosterStudentUuId) {
      res.status(404).json({ error: "Student not found." });
      return;
    }

    const { data: evaluation } = await supabase
      .from("ai_evaluations")
      .select("id")
      .match({
        roster_student_id: rosterStudentUuId,
        assignment_id: assignmentUuId,
        organization_id: organizationUuId,
      })
      .single();

    if (evaluation) {
      res.status(409).json({
        error: "Evaluation already exists, please contact with professor.",
      });
      return;
    }

    (req as any).evaluationData = {
      organizationUuId,
      assignmentUuId,
      rosterStudentUuId,
      feedback,
    };

    next();
  } catch (err) {
    console.error("Error checking evaluation existence:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
