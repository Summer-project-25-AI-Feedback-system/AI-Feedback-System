import { supabase } from "../../../server/utils/supabase";

export async function saveSubmission(
  assignmentId: string,
  studentGithub: string,
  repoUrl: string
) {
  const { data, error } = await supabase.from("submissions").insert([
    {
      assignment_id: assignmentId,
      student_github: studentGithub,
      repo_url: repoUrl,
    },
  ]);

  if (error) throw error;
  return data?.[0];
}
