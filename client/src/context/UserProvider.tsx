import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import UserContext from "./UserContext";
import type { UserContextType } from "./types";
import type { User } from "@shared/githubInterfaces";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/auth/current`, {
        withCredentials: true,
      });
      setUser(data.user || null);
    } catch {
      setUser(null);
    }
  }, []);

  const login = useCallback(() => `${baseUrl}/api/auth/login`, []);

  const logout = useCallback(async () => {
    try {
      await axios.get(`${baseUrl}/api/auth/logout`, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, []);

  // initialing user
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const contextValue: UserContextType = {
    user,
    refreshUser,
    isLogin: user !== null,
    logout,
    login,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
