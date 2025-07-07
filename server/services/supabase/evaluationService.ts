import { AiEvaluation, AiEvaluationInput } from "@shared/supabaseInterfaces";
import { supabase } from "../../utils/supabase";

export const fetchEvaluations = async (organizationId: string, githubAssignmentId?: string, rosterStudentId?: string): Promise<AiEvaluation[]> => {
  let assignment;

  if (githubAssignmentId) {
    let assignmentQuery = supabase
      .from('assignments')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('external_github_assignment_id', githubAssignmentId)
   
    const { data: assignmentData, error: assignmentError } = await assignmentQuery; 

    if (assignmentError || !assignmentData || assignmentData.length === 0) {
      throw new Error('Failed to fetch assignment id for evaluation: ' + (assignmentError?.message || 'assignment not found'));
    }

    assignment = assignmentData[0];
  }

  let query = supabase
    .from('ai_evaluations')
    .select(`*`)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (githubAssignmentId) {
    if (!assignment || !assignment.id) {
      throw new Error('Assignment ID not found, cannot filter evaluations by assignment.');
    }

    query = query.eq('assignment_id', assignment.id); 
  }

  if (rosterStudentId) {
    if (rosterStudentId.length === 0) {
      throw new Error('Roster student ID not found');
    }
    
    query = query.eq('roster_student_id', rosterStudentId);
  } 

  const { data, error } = await query;

  if (error) {
    throw new Error('Failed to fetch evaluation data: ' + error.message);
  }

  return data;
};

export const createOrUpdateEvaluations = async (organizationId: string, evaluations: AiEvaluationInput | AiEvaluationInput[]) => {
  const evaluationsArray = Array.isArray(evaluations) ? evaluations : [evaluations];
  
  const dataToInsert = evaluationsArray.map((e) => ({
    ...e,
    organization_id: organizationId,
  }));

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