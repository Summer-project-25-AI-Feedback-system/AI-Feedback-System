import { supabase } from "../utils/supabase";

export async function upsertUser(
  githubId: string,
  username: string,
  email: string,
  githubUrl: string
) {
  try {
    const result = await supabase
      .from("users")
      .upsert(
        {
          github_id: githubId,
          username: username,
          github_url: githubUrl,
          email: email,
        },
        { onConflict: "github_id" }
      )
      .select()
      .single();

    // console.log("Supabase upsert result:", result);

    if (result.error) {
      console.error("Supabase error:", result.error);
      throw result.error;
    }

    return result.data;
  } catch (err) {
    console.error("Virhe käyttäjän tallennuksessa (catch):", err);
    throw err;
  }
}
