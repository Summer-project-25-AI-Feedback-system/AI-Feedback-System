import { supabase } from "../../utils/supabase";

export const fetchUserByGitHubId = async (githubId: string) => {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('github_id', githubId)
    .single();

  if (userError || !userData) {
    const err: any = new Error('User not found');
    err.status = 404;
    throw err;
  }
}