export interface OrgInfo {
  name: string;
  description: string | null;
  avatarUrl: string;
}

export interface AssignmentInfo {
  name: string;
  submissionCount: number;
  lastUpdated?: string;
}

export interface RepoInfo {
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
  id: number;
  name: string;
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

export interface User {
  id: string;
  username: string;
  displayName?: string;
  profileUrl?: string;
  photos?: { value: string }[];
}
