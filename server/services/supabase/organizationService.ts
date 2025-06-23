import { supabase } from "../../utils/supabase";
import type { Organizations } from '@shared/supabaseInterfaces'

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

export const createOrUpdateOrganizations = async (githubId: string, organizations: Organizations | Organizations[]) => {
  const organizationsArray = Array.isArray(organizations) ? organizations : [organizations];

  const { data: userRecord, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('github_id', githubId)
    .single();

  if (userError || !userRecord) {
    throw new Error('Unable to find currently logged in user from supabase');
  }

  const userId = userRecord.id;

  const dataToInsert = organizationsArray.map((o) => ({
    ...o,
    owner_id: userId,
  }));

  const { error } = await supabase
    .from('organizations')
    .upsert(dataToInsert, { onConflict: 'external_github_org_id' }); 

  if (error) throw error;
}; 