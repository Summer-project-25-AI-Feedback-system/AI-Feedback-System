// Provides state and logic (data + functions)
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import UserContext from "./UserContext";
import type { UserContextType } from "./types";
import type { User } from "@shared/githubInterfaces";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/auth/getCurrentUser`, {
        withCredentials: true,
      });
      setUser(res.data.user || null);
    } catch {
      setUser(null);
    }
  };

  const login = () => {
    return `${baseUrl}/api/auth/login`;
  };

  const logout = async () => {
    try {
      await axios.get(`${baseUrl}/api/auth/logout`, { withCredentials: true });
      setUser(null);
      window.location.href = "/"; // Force full page reload to home/login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

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
