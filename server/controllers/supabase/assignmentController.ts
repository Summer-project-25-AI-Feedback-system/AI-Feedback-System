import { Request, Response } from "express";
import {
  fetchAssignments,
  createOrUpdateAssignments,
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
