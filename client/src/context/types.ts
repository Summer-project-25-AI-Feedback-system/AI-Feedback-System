import type {
  OrgInfo,
  AssignmentInfo,
  RepoInfo,
  User,
} from "@shared/githubInterfaces";

export interface GitHubContextType {
  getOrganizations: () => Promise<OrgInfo[]>;
  getAssignments: (orgLogin: string) => Promise<AssignmentInfo[]>;
  getRepos: (org: string, assignmentPrefix?: string) => Promise<RepoInfo[]>;
  getAllOrganizationData: (org: string) => Promise<any>;
}

export interface UserContextType {
  user: User | null;
  isLogin: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  login: () => string;
}
