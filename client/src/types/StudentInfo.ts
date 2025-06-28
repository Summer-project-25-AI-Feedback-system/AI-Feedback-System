// type used in the student table
export type StudentInfo = {
  grades: (number | string)[];
  totalPoints: number;
  submissionCount: number;
  github_roster_identifier: string;
  github_username?: string;
  github_user_id?: string;
  github_display_name?: string;
};