import { useMemo } from "react";
import axios from "axios";
import SupabaseContext from "./SupabaseContext";
import type { SupabaseContextType } from "./SupabaseContextTypes";
import type { Organizations, Assignments, Rosters, AiEvaluations } from "@shared/supabaseInterfaces";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => { 
  const addOrganizations = async (data: Partial<Organizations>[]): Promise<void> => {
    await axios.post(`${baseUrl}/api/supabase/organizations`, data, {
      withCredentials: true,
    });
  };

  const getAssignments = async (orgId: string): Promise<Assignments[]> => {
    const res = await axios.get(`${baseUrl}/api/supabase/${orgId}/assignments`, {
      withCredentials: true,
    });
    return res.data;
  };

  const addAssignments = async (orgId: string, data: Partial<Assignments>[]): Promise<void> => {
    await axios.post(`${baseUrl}/api/supabase/${orgId}/assignments`, data, {
      withCredentials: true,
    });
  };

  const getRoster = async (orgId: string): Promise<Rosters> => {
    const res = await axios.get(`${baseUrl}/api/supabase/${orgId}/roster`, {
      withCredentials: true,
    });
    return res.data;
  };

  const addRoster = async (orgId: string, data: Partial<Rosters>): Promise<void> => {
    await axios.post(`${baseUrl}/api/supabase/${orgId}/roster`, data, {
      withCredentials: true,
    });
  };

  const getEvaluations = async (orgId: string): Promise<AiEvaluations[]> => {
    const res = await axios.get(`${baseUrl}/api/supabase/${orgId}/evaluations`, {
      withCredentials: true,
    });
    return res.data;
  };

  const addEvaluations = async (orgId: string, data: Partial<AiEvaluations>): Promise<void> => {
    await axios.post(`${baseUrl}/api/supabase/${orgId}/evaluations`, data, {
      withCredentials: true,
    });
  };

  const contextValue: SupabaseContextType = useMemo(
    () => ({
      addOrganizations,
      getAssignments,
      addAssignments,
      getRoster,
      addRoster,
      getEvaluations,
      addEvaluations,
    }),
    []
  );

  return (
    <SupabaseContext.Provider value={contextValue}>
      {children}
    </SupabaseContext.Provider>
  );
}