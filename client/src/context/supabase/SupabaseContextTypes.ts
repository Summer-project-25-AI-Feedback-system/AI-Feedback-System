import type {
  OrganizationInput,
  Assignment,
  AssignmentInput,
  AiEvaluation,
  RosterWithStudents,
  RosterWithStudentsInput,
  AiEvaluationInput,
  AssignmentWithIssues
} from "@shared/supabaseInterfaces";

export interface SupabaseContextType {
  addOrganizations: (data: OrganizationInput | OrganizationInput[]) => Promise<void>;

  getAssignments: (orgId: string, assignmentId?: string) => Promise<Assignment[]>;
  addAssignments: (orgId: string, data: AssignmentInput | AssignmentInput[]) => Promise<void>;

  getRoster: (orgId: string) => Promise<RosterWithStudents | null>;
  addRoster: (orgId: string, data: RosterWithStudentsInput) => Promise<void>;

  getEvaluations: (orgId: string) => Promise<AiEvaluation[]>;
  addEvaluations: (orgId: string, data: AiEvaluationInput | AiEvaluationInput[]) => Promise<void>;

  getAssignmentIssues: (orgId: string) => Promise<AssignmentWithIssues[]>;
}