import { supabase } from "../../utils/supabase";

export async function insertUserToDatabase(
  githubId: string,
  username: string,
  profileUrl = ""
) {
  try {
    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          github_id: githubId,
          username: username,
          profile_url: profileUrl,
        },
        { onConflict: "github_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Supabase upsert error:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("fail to insert user to database:", err);
    throw err;
  }
}
