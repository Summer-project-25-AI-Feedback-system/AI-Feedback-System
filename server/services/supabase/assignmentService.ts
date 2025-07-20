import { Assignment, AssignmentInput } from "@shared/supabaseInterfaces";
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
