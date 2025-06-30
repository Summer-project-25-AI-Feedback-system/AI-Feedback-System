export interface OrgInfo {
  id: number;
  name: string;
  description: string | null;
  avatarUrl: string;
}

export interface AssignmentInfo {
  id: number;
  name: string;
  amountOfStudents: number;
  updatedAt: string;
}

export type DetailedAssignmentInfo = {
  id: number;
  name: string;
  accepted: number;
  submitted: number;
  passing: number;
  deadline: Date | null;
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

export interface CommitAuthor {
  name: string;
  email: string;
  date: string;
}

export interface Commit {
  message: string;
  author: CommitAuthor;
}

export interface CommitInfo {
  sha: string;
  html_url: string;
  commit: Commit;
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
}

export interface CompareCommitsInfo {
  status: string;
  ahead_by: number;
  behind_by: number;
  total_commits: number;
  commits: CommitInfo[];
  files: {
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
  }[];
}
