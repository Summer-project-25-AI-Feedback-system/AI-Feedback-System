export interface Organization {
  id: number;
  name: string;
  external_github_org_id: number;
  owner_id: string;
}

export interface OrganizationInput {
  name: string;
  external_github_org_id: number;
}

export interface Assignment {
  id: string,
  external_github_assignment_id: number,
  organization_id: string,
  name: string,
  max_points: number,
  submitted?: number, // how many students have made a submission to this assignment
}

export interface AssignmentInput {
  external_github_assignment_id: number,
  name: string,
  max_points: number,
  submitted?: number,
}

export interface Rosters {
  id?: string,
  organization_id?: string,
  amount_of_students: number
}

export interface RosterStudents {
  id?: string,
  roster_id?: string,
  github_roster_identifier: string,
  github_username?: string,
  github_user_id?: string,
  github_display_name?: string
}

export interface RosterWithStudents extends Rosters {
  roster_students: RosterStudents[];
}

export interface AiEvaluations {
  id?: string,
  roster_student_id: string,
  assignment_id: string,
  organization_id: string, 
  created_at: Date,
  ai_model: string,
  md_file: string
}