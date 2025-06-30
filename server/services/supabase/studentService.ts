import { supabase } from "../../utils/supabase";

// to fetch one student ID or multiple IDs. 
// IDs must link to a specific github_username (if fetching one student) and to an organization ID in all cases
export const fetchRosterStudents = async (organizationId: string, githubUsername?: string): Promise<{ id: string }[]> => {
  const { data: roster, error: rosterError } = await supabase
    .from('rosters')
    .select('id')
    .eq('organization_id', organizationId)
    .single();

  if (rosterError || !roster) {
    throw new Error(`Error fetching roster: ${rosterError?.message || 'No roster found'}`);
  }

  const rosterId = roster.id;

  let query = supabase
    .from('roster_students')
    .select('id') 
    .eq('roster_id', rosterId);

  if (githubUsername) {
    query = query.eq('github_username', githubUsername);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching roster student(s): ${error.message}`);
  }

  return data || [];
};