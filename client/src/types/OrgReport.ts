export type OrgReport = {
  org: string;
  assignments: string[];
  submissions: {
    student: string;
    grades: Record<string, number | string | null>; 
  }[];
};