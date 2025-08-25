import type { AssignmentInput } from "@shared/supabaseInterfaces";
import type { AssignmentInfo } from "@shared/githubInterfaces";

export const mapToSupabaseAssignments = (fetched: AssignmentInfo[]): AssignmentInput[] =>
  fetched.map((a) => ({
    external_github_assignment_id: a.id,
    name: a.name
  })
);