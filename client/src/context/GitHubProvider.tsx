import { useMemo } from "react";
import axios from "axios";
import GitHubContext from "./GitHubContext";
import type { GitHubContextType } from "./types";
import type {
  AssignmentInfo,
  OrgInfo,
  RepoInfo,
} from "@shared/githubInterfaces";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const GitHubProvider = ({ children }: { children: React.ReactNode }) => {
  const getOrganizations = async (): Promise<OrgInfo[]> => {
    const res = await axios.get(`${baseUrl}/api/github/orgs`, {
      withCredentials: true,
    });
    return res.data;
  };

  const getAssignments = async (
    orgLogin: string
  ): Promise<AssignmentInfo[]> => {
    const res = await axios.get(
      `${baseUrl}/api/github/orgs/${orgLogin}/assignments`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  };

  const getStudentRepos = async (
    org: string,
    assignmentPrefix = ""
  ): Promise<RepoInfo[]> => {
    const res = await axios.get(`${baseUrl}/api/github/student-repos`, {
      withCredentials: true,
      params: { org, assignmentPrefix },
    });
    return res.data;
  };

  const contextValue: GitHubContextType = useMemo(
    () => ({
      getOrganizations,
      getStudentRepos,
      getAssignments,
    }),
    []
  );

  return (
    <GitHubContext.Provider value={contextValue}>
      {children}
    </GitHubContext.Provider>
  );
};
