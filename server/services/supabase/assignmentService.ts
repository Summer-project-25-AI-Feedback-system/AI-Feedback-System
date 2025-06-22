import { supabase } from "../../utils/supabase";

export const fetchAssignments = async (organizationId: string, assignmentId?: string) => {
  let query = supabase
    .from('assignments')
    .select('*')
    .eq('organization_id', organizationId);

  if (assignmentId) {
    query = query.eq('external_github_assignment_id', assignmentId);
  }

  const { data, error } = await query;

  if (error) {
    const err: any = new Error('Failed to fetch assignments');
    err.status = 500;
    throw err;
  }

  return data;
};

export const createOrUpdateAssignments = async (organizationId: string, assignments: any | any[]) => {
  const assignmentsArray = Array.isArray(assignments) ? assignments : [assignments];

  const dataToInsert = assignmentsArray.map((a) => ({
    ...a,
    organization_id: organizationId,
  }));

  const { error } = await supabase
    .from('assignments')
    .upsert(dataToInsert, { onConflict: 'external_github_assignment_id' }); 

  if (error) throw error;
};