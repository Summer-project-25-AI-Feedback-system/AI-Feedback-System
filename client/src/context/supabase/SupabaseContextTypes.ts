import type {
  Organizations,
  Assignments,
  Rosters,
  AiEvaluations
} from "@shared/supabaseInterfaces";

export interface SupabaseContextType {
  addOrganizations: (data: Partial<Organizations>[]) => Promise<void>;

  getAssignments: (orgId: string) => Promise<Assignments[]>;
  addAssignments: (orgId: string, data: Partial<Assignments>[]) => Promise<void>;

  getRoster: (orgId: string) => Promise<Rosters>;
  addRoster: (orgId: string, data: Partial<Rosters>) => Promise<void>;

  getEvaluations: (orgId: string) => Promise<AiEvaluations[]>;
  addEvaluations: (orgId: string, data: Partial<AiEvaluations>) => Promise<void>;
}