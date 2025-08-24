import {
  RosterWithStudents,
  RosterWithStudentsInput,
} from "@shared/supabaseInterfaces";
import { supabase } from "../../utils/supabase";

export const fetchRoster = async (
  organizationId: string
): Promise<RosterWithStudents | null> => {
  const { data, error } = await supabase
    .from("rosters")
    .select(
      `
      *,
      roster_students(*)
    `
    )
    .eq("organization_id", organizationId)
    .single();

  if (error && error.code !== "PGRST116") throw error; // code 116 = no rows

  return data;
};

export const createOrUpdateRoster = async (
  organizationId: string,
  rosterData: RosterWithStudentsInput
) => {
  const rosterCore = {
    organization_id: organizationId,
    amount_of_students: rosterData.amount_of_students,
  };

  const { data: rosterResult, error: rosterError } = await supabase
    .from("rosters")
    .upsert(rosterCore, { onConflict: "organization_id" })
    .select()
    .single();

  if (rosterError || !rosterResult) throw rosterError;

  const rosterId = rosterResult.id;

  const { data: existingStudents, error: fetchError } = await supabase
    .from("roster_students")
    .select("*")
    .eq("roster_id", rosterId);

  if (fetchError) throw fetchError;

  const existingByIdentifier = new Map(
    existingStudents?.map((s) => [s.github_roster_identifier, s])
  );

  const incomingIdentifiers = new Set(
    rosterData.roster_students?.map((s) => s.github_roster_identifier) ?? []
  );

  const newStudents = rosterData.roster_students.filter(
    (student) => !existingByIdentifier.has(student.github_roster_identifier)
  );

  if (newStudents.length > 0) {
    const studentRecords = newStudents.map((student: any) => ({
      roster_id: rosterId,
      github_roster_identifier: student.github_roster_identifier,
      github_username: student.github_username || null,
      github_user_id: student.github_user_id || null,
      github_display_name: student.github_display_name || null,
    }));

    const { error: insertError } = await supabase
      .from("roster_students")
      .insert(studentRecords);

    if (insertError) throw insertError;
  }

  const studentsToDelete = existingStudents.filter(
    (student) => !incomingIdentifiers.has(student.github_roster_identifier)
  );

  if (studentsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("roster_students")
      .delete()
      .in(
        "id",
        studentsToDelete.map((s) => s.id)
      );

    if (deleteError) throw deleteError;
  }

  const studentsToUpdate = rosterData.roster_students.filter((student) =>
    existingByIdentifier.has(student.github_roster_identifier)
  );

   for (const student of studentsToUpdate) {
    const existing = existingByIdentifier.get(student.github_roster_identifier);

    if (
      existing.github_username !== student.github_username ||
      existing.github_user_id !== student.github_user_id ||
      existing.github_display_name !== student.github_display_name
    ) {
      const { error: updateError } = await supabase
        .from("roster_students")
        .update({
          github_username: student.github_username || null,
          github_user_id: student.github_user_id || null,
          github_display_name: student.github_display_name || null,
        })
        .eq("id", existing.id);

      if (updateError) throw updateError;
    }
  }
};

export async function fetchRosterStudentId(
  account: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("roster_students")
    .select("id")
    .eq("github_username", account)
    .single();

  if (error || !data) {
    console.error("Roster id fetch error:", error);
    return null;
  }

  return data.id;
}
