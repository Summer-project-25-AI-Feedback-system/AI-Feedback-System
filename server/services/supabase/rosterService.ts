import { RosterWithStudents } from "@shared/supabaseInterfaces";
import { supabase } from "../../utils/supabase";

export const fetchRoster = async (organizationId: string): Promise<RosterWithStudents | null> => {
  const { data, error } = await supabase
    .from('rosters')
    .select(`
      *,
      roster_students(*)
    `)
    .eq('organization_id', organizationId)
    .single(); 

  if (error && error.code !== 'PGRST116') throw error; // code 116 = no rows

  return data;
};

// TODO: add functionality so if deleting old roster students succeeds but adding new ones doesn't, then nothing works at all and so on
export const createOrUpdateRoster = async (organizationId: string, rosterData: RosterWithStudents) => { 
  const rosterCore = {
    organization_id: organizationId,
    amount_of_students: rosterData.amount_of_students,
  };

  const { data: rosterResult, error: rosterError } = await supabase
    .from('rosters')
    .upsert(rosterCore, { onConflict: 'organization_id'}) 
    .select()
    .single();

  if (rosterError || !rosterResult) throw rosterError;

  const rosterId = rosterResult.id;

  if (rosterData.roster_students && rosterData.roster_students.length > 0) {
    const { error: deleteError } = await supabase
      .from('roster_students')
      .delete()
      .eq('roster_id', rosterId);

    if (deleteError) throw deleteError;

    const studentRecords = rosterData.roster_students.map((student: any) => ({
      roster_id: rosterId,
      github_roster_identifier: student.github_roster_identifier,
      github_username: student.github_username || null,
      github_user_id: student.github_user_id || null,
      github_display_name: student.github_display_name || null,
    }));

    const { error: studentError } = await supabase
      .from('roster_students')
      .insert(studentRecords);

    if (studentError) throw studentError;
  }
};