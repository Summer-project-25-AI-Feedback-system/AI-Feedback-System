import { supabase } from "../../utils/supabase";
import type { OrganizationInput} from '@shared/supabaseInterfaces'

export const createOrUpdateOrganizations = async (githubId: string, organizations: OrganizationInput | OrganizationInput[]) => {
  const organizationsArray = Array.isArray(organizations) ? organizations : [organizations];

  // get the logged in user's id
  const { data: userRecord, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('github_id', githubId)
    .single();

  if (userError || !userRecord) {
    throw new Error('Unable to find currently logged in user from supabase');
  }

  const userId = userRecord.id;

  // fetch existing organizations from supabase for the user
  const { data: existingOrgs, error: fetchError } = await supabase
    .from('organizations')
    .select('external_github_org_id')
    .eq('owner_id', userId);

  if (fetchError) {
    throw new Error('Failed to fetch existing organizations');
  }

  const incomingOrgIds = new Set(organizationsArray.map((o) => o.external_github_org_id));
  const existingOrgIds = new Set((existingOrgs || []).map((o) => o.external_github_org_id));

  // select organizations which the user has deleted from github
  const orgsToDelete = Array.from(existingOrgIds).filter(
    (id) => !incomingOrgIds.has(id)
  );

  // if there are no longer existing organizations, delete them
  if (orgsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from('organizations')
      .delete()
      .in('external_github_org_id', orgsToDelete)
      .eq('owner_id', userId); 

    if (deleteError) {
      throw new Error('Failed to delete removed organizations');
    }
  }

  // add/update the current organizations of the user into github
  const dataToInsert = organizationsArray.map((o) => ({
    ...o,
    owner_id: userId,
  }));

  const { error } = await supabase
    .from('organizations')
    .upsert(dataToInsert, { onConflict: 'external_github_org_id' }); 

  if (error) throw error;
}; 