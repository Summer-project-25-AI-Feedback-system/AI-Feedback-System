import { useMemo } from "react";
import axios from "axios";
import SupabaseContext from "./SupabaseContext";
import type { SupabaseContextType } from "./SupabaseContextTypes";
import type {
  OrganizationInput,
  Assignment,
  AssignmentInput,
  RosterWithStudents,
  RosterWithStudentsInput,
  AiEvaluation,
  AiEvaluationInput,
} from "@shared/supabaseInterfaces";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const SupabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const addOrganizations = async (
    data: OrganizationInput | OrganizationInput[]
  ): Promise<void> => {
    await axios.post(`${baseUrl}/api/supabase/organizations`, data, {
      withCredentials: true,
    });
  };
  const getOrganizations = async (): Promise<OrganizationInput[]> => {
    const res = await axios.get(`${baseUrl}/api/supabase/organizations`, {
      withCredentials: true,
    });
    return res.data;
  };

  const getAssignments = async (
    orgId: string,
    assignmentId?: string
  ): Promise<Assignment[]> => {
    const res = await axios.get(
      `${baseUrl}/api/supabase/${orgId}/assignments`,
      {
        params: assignmentId ? { github_assignment_id: assignmentId } : {},
        withCredentials: true,
      }
    );
    return res.data;
  };

  const addAssignments = async (
    orgId: string,
    data: AssignmentInput | AssignmentInput[]
  ): Promise<void> => {
    await axios.post(`${baseUrl}/api/supabase/${orgId}/assignments`, data, {
      withCredentials: true,
    });
  };

  const getRoster = async (
    orgId: string
  ): Promise<RosterWithStudents | null> => {
    const res = await axios.get(`${baseUrl}/api/supabase/${orgId}/roster`, {
      withCredentials: true,
    });
    return res.data;
  };

  const addRoster = async (
    orgId: string,
    data: RosterWithStudentsInput
  ): Promise<void> => {
    await axios.post(`${baseUrl}/api/supabase/${orgId}/roster`, data, {
      withCredentials: true,
    });
  };

  const getEvaluations = async (
    orgId: string,
    assignmentId?: string,
    rosterStudentId?: string
  ): Promise<AiEvaluation[]> => {
    const params = new URLSearchParams();
    if (assignmentId) params.append("github_assignment_id", assignmentId);
    if (rosterStudentId) params.append("roster_student_id", rosterStudentId);
    const res = await axios.get(
      `${baseUrl}/api/supabase/${orgId}/evaluations?${params.toString()}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  };

  const addEvaluations = async (
    orgId: string,
    data: AiEvaluationInput | AiEvaluationInput[]
  ): Promise<void> => {
    await axios.post(`${baseUrl}/api/supabase/${orgId}/evaluations`, data, {
      withCredentials: true,
    });
  };

  const contextValue: SupabaseContextType = useMemo(
    () => ({
      addOrganizations,
      getOrganizations,
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
};
