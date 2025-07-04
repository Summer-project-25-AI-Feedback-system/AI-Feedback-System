import { AiEvaluations } from "@shared/supabaseInterfaces";
import { getSupabaseClient } from "../../utils/supabase";

export const fetchEvaluations = async (organizationId: string, githubAssignmentId?: string, rosterStudentId?: string) => {
  const supabase = getSupabaseClient();
  // ... existing code ...
};

export const createOrUpdateEvaluations = async (organizationId: string, evaluations: AiEvaluations | AiEvaluations[]) => {
  const supabase = getSupabaseClient();
  
  const evaluationsArray = Array.isArray(evaluations) ? evaluations : [evaluations];
  
  const dataToInsert = evaluationsArray.map((e) => ({
    ...e,
    organization_id: organizationId,
  }));

  console.log("Tarkistetaan assignment:", dataToInsert[0].assignment_id);
  const { data: assignmentData, error: assignmentError } = await supabase
    .from('assignments')
    .select('*')
    .eq('id', dataToInsert[0].assignment_id)
    .single();
  
  console.log("Assignment data:", assignmentData);
  console.log("Assignment error:", assignmentError);

  const { data, error } = await supabase
    .from('ai_evaluations')
    .upsert(dataToInsert, { onConflict: 'roster_student_id,assignment_id,organization_id' });

  console.log("Supabase upsert data:", data);
  if (error) {
    console.error("Supabase error:", error);
    throw new Error(`Failed to store evaluation: ${error.message}`);
  }
};