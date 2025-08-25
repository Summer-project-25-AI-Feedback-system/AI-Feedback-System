import { Request, Response } from "express";
import {
  fetchAssignments,
  createOrUpdateAssignments,
  fetchAssignmentSubmittedValue,
} from "../../services/supabase/assignmentService";

export const getAssignments = async (req: Request, res: Response) => {
  const organizationId = (req as any).organizationId;
  const { github_assignment_id } = req.query;

  try {
    const assignments = await fetchAssignments(
      organizationId,
      github_assignment_id as string | undefined
    );
    res.status(200).json(assignments);
  } catch (error: any) {
    if (error.status === 404) {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error("Unexpected error fetching assignment(s):", error);
    res.status(500).json({
      error: "Unexpected server error while retrieving assignment(s)",
    });
  }
};

export const addAssignments = async (req: Request, res: Response) => {
  const organizationId = (req as any).organizationId;
  const assignments = req.body;

  try {
    await createOrUpdateAssignments(organizationId, assignments);
    res.status(200).send("Assignment(s) created or updated");
  } catch (error: any) {
    if (error.status === 404) {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error("Unexpected error storing assignment(s):", error);
    res.status(500).json({ error: "Failed to store assignment(s)" });
  }
};

export const getAssignmentSubmittedValue = async (req: Request, res: Response) => {
  const organizationId = (req as any).organizationId;
  const assignmentId = req.query.assignmentId ? Number(req.query.assignmentId) : undefined;

  if (!assignmentId) {
    res.status(400).json({ error: "assignmentId query param is required" });
    return;
  }

  try {
    const submitted = await fetchAssignmentSubmittedValue(organizationId, assignmentId);
    res.status(200).json(submitted);
  } catch (error: any) {
    if (error.status === 404) {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error("Unexpected error fetching assignment submitted value:", error);
    res.status(500).json({
      error: "Unexpected server error while retrieving assignment submitted value:",
    });
  }
}
