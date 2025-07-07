// this is the output of the handleGetAllOrganizationData() call to the backend (using GitHub API)
export type OrgReport = {
  org: string;
  orgId: number;
  assignments: string[];
  submissions: {
    student: string; // student github username
    grades: Record<string, number | string | null>; 
  }[];
};