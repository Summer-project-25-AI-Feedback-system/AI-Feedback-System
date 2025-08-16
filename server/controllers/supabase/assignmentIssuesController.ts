import { Request, Response } from "express";
import { fetchAssignmentIssues } from "../../services/supabase/assignmentIssuesService";

export const getAssignmentIssuesForOrg = async (req: Request, res: Response) => {
  const organizationId = (req as any).organizationId;
  try {
    const assignmentIssues = await fetchAssignmentIssues(organizationId);
    res.status(200).json(assignmentIssues);
  } catch (error: any) {
    if (error.status === 404) {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error("Unexpected error fetching assignment issues:", error);
    res.status(500).json({
      error: "Unexpected server error while retrieving assignment issues",
    });
  }
};