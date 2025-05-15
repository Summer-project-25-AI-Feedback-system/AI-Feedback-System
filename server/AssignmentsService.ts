import { supabase } from "./utils/supabase";

export async function saveAssignment(name: string, githubUrl: string) {
  const { data, error } = await supabase
    .from("assignments")
    .insert([{ name, github_url: githubUrl }]);

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }
}
