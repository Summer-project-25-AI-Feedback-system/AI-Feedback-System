import { Assignment, AssignmentInput, AssignmentMaxScoreInfo } from "@shared/supabaseInterfaces";
import { supabase } from "../../utils/supabase";

export const fetchAssignments = async (
  organizationId: string,
  assignmentId?: string
): Promise<Assignment[]> => {
  let query = supabase
    .from("assignments")
    .select("*")
    .eq("organization_id", organizationId);

  if (assignmentId) {
    query = query.eq("external_github_assignment_id", assignmentId);
  }

  const { data, error } = await query;

  if (error) {
    const err: any = new Error("Failed to fetch assignments");
    err.status = 500;
    throw err;
  }

  return data;
};

export const createOrUpdateAssignments = async (
  organizationId: string,
  assignments: AssignmentInput | AssignmentInput[]
) => {
  const assignmentsArray = Array.isArray(assignments)
    ? assignments
    : [assignments];

  // fetch existing assignments from supabase for the user
  const { data: existingAssignments, error: fetchError } = await supabase
    .from("assignments")
    .select("external_github_assignment_id")
    .eq("organization_id", organizationId);

  if (fetchError) {
    throw new Error("Failed to fetch existing assignments");
  }

  const incomingAssignmentIds = new Set(
    assignmentsArray.map((a) => a.external_github_assignment_id)
  );
  const existingAssignmentIds = new Set(
    (existingAssignments || []).map((o) => o.external_github_assignment_id)
  );

  // select assignments which the user has deleted from github
  const assignmentsToDelete = Array.from(existingAssignmentIds).filter(
    (id) => !incomingAssignmentIds.has(id)
  );

  // if there are no longer existing assignments, delete them
  if (assignmentsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("assignments")
      .delete()
      .in("external_github_assignment_id", assignmentsToDelete)
      .eq("organization_id", organizationId);

    if (deleteError) {
      console.error("deleteError:", deleteError);
      throw new Error(
        "Failed to delete assignments from DB that no longer exist in GitHub."
      );
    }
  }

  // add/update current assignments
  const dataToInsert = assignmentsArray.map((a) => ({
    ...a,
    organization_id: organizationId,
  }));

  const { error } = await supabase
    .from("assignments")
    .upsert(dataToInsert, { onConflict: "external_github_assignment_id" });

  if (error) throw error;
};

export const createOrUpdateAssignmentMaxScore = async (
  assignmentId: string,
  maxScore: number
) => {
  const { error } = await supabase
    .from("assignments")
    .update({ max_points: maxScore })
    .eq("id", assignmentId);

  if (error) {
    throw new Error(`Failed to upsert assignment max points: ${error.message}`);
  }
}

/* export const fetchAssignmentMaxScores = async (
  externalOrganizationId: number,
 ): Promise<AssignmentMaxScoreInfo[]> => {
  const { data: orgData, error: orgError } = await supabase
    .from("organizations")
    .select("*")
    .eq("external_github_org_id", externalOrganizationId)
    .single();
  
  if (orgError) {
    throw new Error(`Failed to fetch organization: ${orgError.message}`);
  }
  
  if (!orgData) {
    throw new Error("Organization not found");
  }

  const { data, error } = await supabase
    .from("assignments")
    .select("id, name, max_points")
    .eq("organization_id", orgData.id);

  if (error) {
    throw new Error(`Failed to fetch assignment max points: ${error.message}`);
  }

  return data ?? [];
} */

export async function handleGetAssignmentId(
  organizationUuId: string,
  assignmentId: string
): Promise<string | null> {
  const { data: assignment, error: assignmentError } = await supabase
    .from("assignments")
    .select("id")
    .eq("organization_id", organizationUuId)
    .eq("external_github_assignment_id", assignmentId)
    .single();

  if (assignmentError || !assignment) {
    console.error("Failed to fetch assignment:", assignmentError);
    return null;
  }
  return assignment.id;
}
