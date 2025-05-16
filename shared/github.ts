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
