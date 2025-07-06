import { useEffect, useState, useMemo, useCallback } from "react";
import isEqual from "lodash/isEqual";
import axios from "axios";
import UserContext from "./UserContext";
import type { UserContextType } from "./types";
import type { User } from "@shared/githubInterfaces";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Use useCallback to stabilize the refreshUser function
  const refreshUser = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/auth/getCurrentUser`, {
        withCredentials: true,
      });
      // Only update state if user data actually changed
      setUser((prev) => {
        const newUser = res.data.user || null;
        return isEqual(prev, newUser) ? prev : newUser;
      });
    } catch {
      setUser((prev) => (prev === null ? prev : null));
    }
  }, []);

  const login = () => {
    return `${baseUrl}/api/auth/login`;
  };

  const logout = useCallback(async () => {
    try {
      await axios.get(`${baseUrl}/api/auth/logout`, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const contextValue: UserContextType = useMemo(
    () => ({
      user,
      isLogin: !!user,
      refreshUser,
      logout,
      login,
    }),
    [user]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
