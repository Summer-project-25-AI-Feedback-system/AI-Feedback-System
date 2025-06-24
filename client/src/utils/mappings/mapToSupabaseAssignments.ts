import type { Assignments } from "@shared/supabaseInterfaces";
import type { AssignmentInfo } from "@shared/githubInterfaces";

export const mapToSupabaseAssignments = (fetched: AssignmentInfo[], orgId: string): Partial<Assignments>[] =>
  fetched.map((a) => ({
    external_github_assignment_id: String(a.id),
    organization_id: orgId,
    name: a.name,
    deadline: new Date('2025-12-31T23:59:59Z'), // change later to real values
    max_points: 100, // change later to real values
  }));