import { createContext } from "react";
import type { GitHubContextType } from "./types";

const GitHubContext = createContext<GitHubContextType | null>(null);
export default GitHubContext;
