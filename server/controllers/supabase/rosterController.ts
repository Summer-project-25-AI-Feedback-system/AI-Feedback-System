import { Request, Response } from "express";
import {
  fetchRoster,
  createOrUpdateRoster,
  fetchRosterStudentId,
} from "../../services/supabase/rosterService";

export const getRoster = async (req: Request, res: Response) => {
  const organizationId = (req as any).organizationId;

  try {
    const roster = await fetchRoster(organizationId);

    res.status(200).json(roster);
  } catch (error: any) {
    console.error("Error fetching roster:", error);
    res
      .status(500)
      .json({ error: "Unexpected server error while retrieving roster" });
  }
};

export const addRoster = async (req: Request, res: Response) => {
  const organizationId = (req as any).organizationId;
  const rosterData = req.body; // needs to include students as well

  try {
    await createOrUpdateRoster(organizationId, rosterData);
    res.status(201).send("Roster created");
  } catch (error: any) {
    console.error("Error creating roster:", error);
    res.status(500).json({ error: "Failed to add roster" });
  }
};

export async function getRosterStudentIdFromDB(
  req: Request,
  res: Response
): Promise<void> {
  const account = req.params.account;
  if (!account) {
    res.status(400).json({ error: "Missing parameters" });
    return;
  }

  try {
    const studentId = await fetchRosterStudentId(account as string);

    if (!studentId) res.status(404).json({ error: "Roster student not found" });

    res.json({ roster_student_id: studentId });
  } catch (err) {
    console.error("Error fetching roster student:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
