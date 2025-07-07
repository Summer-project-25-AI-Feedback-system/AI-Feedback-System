import { useMemo } from "react";
import axios from "axios";
import GitHubContext from "./GitHubContext";
import type { GitHubContextType } from "./types";
import type {
  AssignmentInfo,
  AssignmentClassroomInfo,
  OrgInfo,
  RepoInfo,
  CommitInfo,
  CompareCommitsInfo,
} from "@shared/githubInterfaces";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const GitHubProvider = ({ children }: { children: React.ReactNode }) => {
  const getOrganizations = async (): Promise<OrgInfo[]> => {
    const res = await axios.get(`${baseUrl}/api/github/orgs`, {
      withCredentials: true,
    });
    return res.data;
  };

  const getAllOrganizationData = async (org: string) => {
    const res = await axios.get(`${baseUrl}/api/github/org-report`, {
      withCredentials: true,
      params: { org },
    });
    return res.data;
  };

  const getAssignments = async (orgName: string): Promise<AssignmentInfo[]> => {
    const res = await axios.get(
      `${baseUrl}/api/github/orgs/${orgName}/assignments`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  };

  const getAssignmentClassroomInfo = async (
    orgName: string
  ): Promise<AssignmentClassroomInfo[]> => {
    const res = await axios.get(
      `${baseUrl}/api/github/orgs/${orgName}/assignmentClassroomInfo`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  };

  const getRepos = async (
    orgName: string,
    assignmentName = ""
  ): Promise<RepoInfo[]> => {
    const res = await axios.get(
      `${baseUrl}/api/github/orgs/${orgName}/assignments/${assignmentName}/repos`,
      { withCredentials: true }
    );
    return res.data;
  };

  const getCommits = async (
    orgName: string,
    repoName: string
  ): Promise<CommitInfo[]> => {
    const res = await axios.get(
      `${baseUrl}/api/github/repos/${orgName}/${repoName}/commits`,
      { withCredentials: true }
    );
    return res.data;
  };

  const getRepoTree = async (
    orgName: string,
    repoName: string
  ): Promise<string[]> => {
    const res = await axios.get(
      `${baseUrl}/api/github/repos/${orgName}/${repoName}/tree`,
      { withCredentials: true }
    );
    return res.data;
  };

  const getFileContents = async (
    orgName: string,
    repoName: string,
    path: string
  ): Promise<string | null> => {
    const res = await axios.get(
      `${baseUrl}/api/github/repos/${orgName}/${repoName}/contents`,
      {
        withCredentials: true,
        params: { path },
      }
    );
    return res.data;
  };

  const compareCommits = async (
    orgName: string,
    repoName: string,
    base: string,
    head: string
  ): Promise<CompareCommitsInfo> => {
    const res = await axios.get(
      `${baseUrl}/api/github/repos/${orgName}/${repoName}/compare/${base}/${head}`,
      { withCredentials: true }
    );
    return res.data;
  };

  const contextValue: GitHubContextType = useMemo(
    () => ({
      getOrganizations,
      getRepos,
      getAllOrganizationData,
      getAssignments,
      getAssignmentClassroomInfo,
      getCommits,
      getRepoTree,
      getFileContents,
      compareCommits,
    }),
    []
  );

  return (
    <GitHubContext.Provider value={contextValue}>
      {children}
    </GitHubContext.Provider>
  );
};
