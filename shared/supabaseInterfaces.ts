export interface Organization {
  id: string;
  name: string;
  external_github_org_id: number;
  owner_id: string;
  submission_limit: number | null;
  description: string | null;
  avatar_url: string;
}

export interface OrganizationInput {
  id?: string | null;
  name: string;
  external_github_org_id: number;
  description?: string | null;
  avatar_url?: string;
  submission_limit?: number | null;
}

export interface Assignment {
  id: string;
  external_github_assignment_id: number;
  organization_id: string;
  name: string;
  max_points: number;
  submitted?: number; // how many students have made a submission to this assignment
}

export interface AssignmentInput {
  external_github_assignment_id: number;
  name: string;
  max_points: number;
  submitted?: number;
}

export interface AssignmentMaxScoreInfo {
  id: string;
  name: string;
  max_points: number;
}

export interface Roster {
  id: string;
  organization_id: string;
  amount_of_students: number;
}

export interface RosterInput {
  amount_of_students: number;
}

export interface RosterStudent {
  id: string;
  roster_id: string;
  github_roster_identifier: string;
  github_username?: string;
  github_user_id?: string;
  github_display_name?: string;
}

export interface RosterStudentInput {
  github_roster_identifier: string;
  github_username?: string;
  github_user_id?: string;
  github_display_name?: string;
}

export interface RosterWithStudents extends Roster {
  roster_students: RosterStudent[];
}

export interface RosterWithStudentsInput extends RosterInput {
  roster_students: RosterStudentInput[];
}

export interface AiEvaluation {
  id: string;
  roster_student_id: string;
  assignment_id: string;
  organization_id: string;
  created_at: Date;
  ai_model: string;
  md_file: string;
  total_score: number | null;
}

export interface AiEvaluationInput {
  roster_student_id: string;
  assignment_id: string;
  organization_id: string;
  created_at: Date;
  ai_model: string;
  md_file: string;
  total_score: number | null;
  commit_count?: number | null;
}

export interface CommonIssuesInput {
  name: string;
}

export interface AssignmentIssue {
  issue_id: string;
  name: string;
  count: number;
}

export interface AssignmentWithIssues {
  assignment_id: string;
  assignment_name: string;
  issues: AssignmentIssue[];
}

export interface AnalyticsAssignment {
  id: string;
  name: string;
  max_points: number;
}

export interface AnalyticsGrade {
  assignmentId: string;
  evaluations: AiEvaluation[]; 
}

export interface AnalyticsSubmission {
  student: string | null; 
  grades: AnalyticsGrade[];
}

export interface AnalyticsResponse {
  assignments: AnalyticsAssignment[];
  submissions: AnalyticsSubmission[];
}

export interface GithubReqBody {
  githubUsername: string;
  orgName: string;
  orgId: string;
  repoName: string;
  assignmentName: string;
  feedback?: string;
  commitCount?: number;
}

export interface CheckEvaluationExistsReqBody {
  githubUsername: string;
  orgName: string;
  orgId: string;
  repoName: string;
  assignmentName: string;
  commitCount: number;
}
