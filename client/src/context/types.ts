import type {
  OrgInfo,
  AssignmentInfo,
  RepoInfo,
  User,
  CommitInfo,
  CompareCommitsInfo,
  AssignmentClassroomInfo,
} from "@shared/githubInterfaces";

export interface GitHubContextType {
  getOrganizations: () => Promise<OrgInfo[]>;
  getOrganization: (orgName: string) =>  Promise<OrgInfo>;
  getAssignments: (orgLogin: string) => Promise<AssignmentInfo[]>;
  getAssignmentClassroomInfo: (orgName: string) => Promise<AssignmentClassroomInfo[]>;
  getAllOrganizationData: (org: string) => Promise<any>; // TODO: change the type here
  getRepos: (org: string, assignmentPrefix?: string) => Promise<RepoInfo[]>;
  getCommits: (orgName: string, repoName: string) => Promise<CommitInfo[]>;
  getRepoTree: (orgName: string, repoName: string) => Promise<string[]>;
  getFileContents: (
    orgName: string,
    repoName: string,
    path: string
  ) => Promise<string | null>;
  compareCommits: (
    orgName: string,
    repoName: string,
    base: string,
    head: string
  ) => Promise<CompareCommitsInfo>;
}

export interface UserContextType {
  user: User | null;
  isLogin: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  login: () => string;
}
