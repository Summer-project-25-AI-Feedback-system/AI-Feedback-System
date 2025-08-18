import { Request, Response } from "express";
import { fetchAssignments } from "../../services/supabase/assignmentService";
import { fetchRoster } from "../../services/supabase/rosterService";
import { fetchEvaluations } from "../../services/supabase/evaluationService";
import { AiEvaluation } from "@shared/supabaseInterfaces";

export async function getAllAnalyticsData(req: Request, res: Response): Promise<void> {
  const organizationId = (req as any).organizationId;

  if (!organizationId) {
    res.status(400).json({ error: "Missing organization ID" });
    return;
  }
  
  try {
    const [assignments, roster, evaluations] = await Promise.all([
      fetchAssignments(organizationId),
      fetchRoster(organizationId),
      fetchEvaluations(organizationId),
    ]);

    if (!roster) {
      res.status(404).json({ error: "Roster not found for this organization" });
      return;
    }

    const students = roster.roster_students ?? [];
    const evalMap = new Map<string, Record<string, AiEvaluation[]>>();

    for (const student of students) {
      evalMap.set(student.id, {});
    }

    for (const ev of evaluations) {
      if (!evalMap.has(ev.roster_student_id)) {
        evalMap.set(ev.roster_student_id, {});
      }
      const studentEvals = evalMap.get(ev.roster_student_id)!;
      if (!studentEvals[ev.assignment_id]) {
        studentEvals[ev.assignment_id] = [];
      }
      studentEvals[ev.assignment_id].push(ev);
    }

    const responseData = {
      assignments: assignments.map((a) => ({
        id: a.id,
        name: a.name,
        max_points: a.max_points
      })),
      submissions: students.map((student) => ({
        student: student.github_username ?? student.github_display_name,
        grades: assignments.map((a) => ({
          assignmentId: a.id,
          evaluations: evalMap.get(student.id)?.[a.id] ?? [],
        })),
      })),
    };

    res.json(responseData);
  } catch (error) {
    console.error("Failed to get analytics data:", error);
    res.status(500).json({ error: "Failed to generate analytics data" });
  }
}