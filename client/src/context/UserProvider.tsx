// Provides state and logic (data + functions)
import { useEffect, useState } from "react";
import axios from "axios";
import UserContext from "./UserContext";
import type { User } from "../types/UserInfo";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = async () => {
    return axios
      .get(`${baseUrl}/api/auth/me`, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user || null);
      })
      .catch(() => setUser(null));
  };

  const login = () => {
    window.location.href = `${baseUrl}/api/auth/login`;
  };

  const logout = async () => {
    await axios.get(`${baseUrl}/api/auth/logout`, { withCredentials: true });
    setUser(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loggedIn: !!user,
        refreshUser,
        logout,
        login,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
