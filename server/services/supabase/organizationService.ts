import { supabase } from "../../utils/supabase";

// get all data from the organization table
export const getOrganizations = async () => {
  const { data, error } = await supabase
    .from('organization')
    .select('*');

  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }

  console.log("Data from getOrganizations: " + data);
  return data;
}