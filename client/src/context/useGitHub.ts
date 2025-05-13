import { useContext } from "react";
import GitHubContext from "./GitHubContext";
import type { GitHubContextType } from "../types/GitHubInfo";

export const useGitHub = (): GitHubContextType => {
  const context = useContext(GitHubContext);

  if (!context) {
    throw new Error("useGitHub must be used within a GitHubProvider");
  }
  return context;
};
