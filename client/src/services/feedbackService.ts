import { supabase } from "../../../server/utils/supabase";

export async function saveFeedback(submissionId: string, aiComment: string, score: number) {
  const { data, error } = await supabase.from("feedback").insert([
    {
      submission_id: submissionId,
      ai_comment: aiComment,
      score,
    },
  ]);

  if (error) throw error;
  return data?.[0];
}