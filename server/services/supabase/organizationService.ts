import { supabase } from "../../utils/supabase";

export const getOrganizations = async () => {
  const { data, error } = await supabase
    .from('organization')
    .select('*');

  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }

  console.log("Data from getOrganizations: " + data);
  return data;
}

export const createOrUpdateOrganizations = async (organizationId: string, assignments: any | any[]) => {
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