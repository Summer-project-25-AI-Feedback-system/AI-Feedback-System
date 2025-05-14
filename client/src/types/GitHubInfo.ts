export interface Repo {
  id: string;
  name: string;
  owner: string;
  avatarUrl: string;
  url: string;
  description?: string;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  lastPush: string;
  lastCommitMessage: string;
  lastCommitDate: string;
  collaborators: Collaborator[];
}

export interface Collaborator {
  login: string;
  id: number;
  avatarUrl: string;
  htmlUrl: string;
  permissions: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  };
}

export interface Org {
  login: string;
  description: string;
  avatarUrl: string;
}

export interface GitHubContextType {
  getOrganizations: () => Promise<
    { login: string; description: string; avatarUrl: string }[]
  >;
  getStudentRepos: (org: string, assignmentPrefix?: string) => Promise<Repo[]>;
}
