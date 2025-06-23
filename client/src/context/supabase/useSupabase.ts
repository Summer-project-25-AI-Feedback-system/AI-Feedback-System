import { useContext } from "react";
import SupabaseContext from "./SupabaseContext";
import type { SupabaseContextType } from "./SupabaseContextTypes";

export const useSupabase = (): SupabaseContextType => {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  
  return context;
};
