import type {
  OrgInfo,
  AssignmentInfo,
  RepoInfo,
} from "@shared/githubInterfaces";

export interface GitHubContextType {
  getOrganizations: () => Promise<OrgInfo[]>;
  getAssignments: (orgLogin: string) => Promise<AssignmentInfo[]>;
  getStudentRepos: (
    org: string,
    assignmentPrefix?: string
  ) => Promise<RepoInfo[]>;
}
