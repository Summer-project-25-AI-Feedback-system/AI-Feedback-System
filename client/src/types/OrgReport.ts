// this is the output of the handleGetAllOrganizationData() call to the backend (using GutHub API)
export type OrgReport = {
  org: string;
  assignments: string[];
  submissions: {
    student: string; // student github username
    grades: Record<string, number | string | null>; 
  }[];
};