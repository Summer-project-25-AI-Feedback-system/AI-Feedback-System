import type {
  Organizations,
  Assignments,
  Rosters,
  Feedbacks
} from "@shared/supabaseInterfaces";

export interface SupabaseContextType {
  addOrganizations: (data: Partial<Organizations>[]) => Promise<void>;

  getAssignments: (orgId: string) => Promise<Assignments[]>;
  addAssignments: (orgId: string, data: Partial<Assignments>[]) => Promise<void>;

  getRoster: (orgId: string) => Promise<Rosters>;
  addRoster: (orgId: string, data: Partial<Rosters>) => Promise<void>;

  getFeedbacks: (orgId: string) => Promise<Feedbacks[]>;
  addFeedback: (orgId: string, data: Partial<Feedbacks>) => Promise<void>;
}