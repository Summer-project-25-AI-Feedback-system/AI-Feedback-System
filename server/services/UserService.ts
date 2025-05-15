import { supabase } from "../utils/supabase";

export async function upsertUser(
githubId: string, username: string, email: string, githubUrl: string){ try {
  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        github_id: githubId,
        username: username,
        github_url: githubUrl,
        email: email,
      },
      {
        onConflict: "github_id", // käytetään vain yksi sarake
      }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
} catch (err) {
    console.error("Virhe käyttäjän tallennuksessa:", err);
}}
