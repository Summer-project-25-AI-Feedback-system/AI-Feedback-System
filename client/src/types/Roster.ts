// this is what we get from each student when a roster from GitHub classroom is created
export type StudentInStudentRoster = {
  identifier: string;
  github_username: string;
  github_id: string;
  name: string;
};

// this is what gets sent to and fetched from supabase
export type Roster = {
  amount_of_students: number;
  roster_students: StudentInStudentRoster[];
};