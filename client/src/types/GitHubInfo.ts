export interface Repo {
  name: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  description?: string;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
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
