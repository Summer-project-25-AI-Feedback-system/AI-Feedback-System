import type {
  OrganizationInput,
  Assignment,
  AssignmentInput,
  AiEvaluations,
  RosterWithStudents
} from "@shared/supabaseInterfaces";

export interface SupabaseContextType {
  addOrganizations: (data: OrganizationInput | OrganizationInput[]) => Promise<void>;

  getAssignments: (orgId: string, assignmentId?: string) => Promise<Assignment[]>;
  addAssignments: (orgId: string, data: AssignmentInput | AssignmentInput[]) => Promise<void>;

  getRoster: (orgId: string) => Promise<RosterWithStudents | null>;
  addRoster: (orgId: string, data: Partial<RosterWithStudents>) => Promise<void>;

  getEvaluations: (orgId: string) => Promise<AiEvaluations[]>;
  addEvaluations: (orgId: string, data: Partial<AiEvaluations>) => Promise<void>;
}