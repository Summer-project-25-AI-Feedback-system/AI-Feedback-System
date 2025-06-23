// TODO: add users?

export interface Organizations {
  id?: number;
  name: string;
  external_github_org_id: string;
  owner_id: string;
}

export interface Assignments {
  id: string,
  external_github_assignment_id: string,
  organization_id: string,
  name: string,
  deadline: Date,
  max_points: number,
  total_students?: number,
  submissions?: number,
  accepted_assignments?: number
}

export interface Rosters {
  id: string,
  organization_id: string,
  amount_of_students: number
}

export interface RosterStudents {
  id: string,
  roster_id: string,
  github_roster_identifier: string,
  github_username?: string,
  github_user_id?: string,
  github_display_name?: string
}

export interface Feedbacks {
  id: string,
  roster_student_id: string,
  assignment_id: string,
  organization_id: string, 
  score: number,
  written_feedback: string,
  created_at: Date
}