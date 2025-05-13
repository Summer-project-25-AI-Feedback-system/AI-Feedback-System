import { createContext } from "react";
import type { GitHubContextType } from "../types/GitHubInfo";

const GitHubContext = createContext<GitHubContextType | null>(null);
export default GitHubContext;
