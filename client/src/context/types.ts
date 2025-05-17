import type {
  OrgInfo,
  AssignmentInfo,
  RepoInfo,
} from "@shared/githubInterfaces";

export interface GitHubContextType {
  getOrganizations: () => Promise<OrgInfo[]>;
  getAssignments: (orgLogin: string) => Promise<AssignmentInfo[]>;
  getRepos: (org: string, assignmentPrefix?: string) => Promise<RepoInfo[]>;
}
