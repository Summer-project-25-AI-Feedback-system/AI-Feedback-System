import { useMemo } from "react";
import axios from "axios";
import GitHubContext from "./GitHubContext";
import type { GitHubContextType, Repo } from "../types/GitHubInfo";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const GitHubProvider = ({ children }: { children: React.ReactNode }) => {
  const getOrganizations = async () => {
    const res = await axios.get(`${baseUrl}/api/github/organizations`, {
      withCredentials: true,
    });
    return res.data;
  };

  const getStudentRepos = async (
    org: string,
    assignmentPrefix = ""
  ): Promise<Repo[]> => {
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
    }),
    []
  );

  return (
    <GitHubContext.Provider value={contextValue}>
      {children}
    </GitHubContext.Provider>
  );
};
