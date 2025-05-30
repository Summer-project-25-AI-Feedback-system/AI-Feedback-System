export type OrgReport = {
  org: string;
  assignments: string[];
  submissions: {
    student: string; // student github username
    grades: Record<string, number | string | null>; 
  }[];
};