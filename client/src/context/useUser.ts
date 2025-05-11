// Exports the custom hook for using the context
import { useContext } from "react";
import UserContext from "./UserContext";
import type { UserContextType } from "../types/UserInfo";

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
