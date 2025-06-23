import { createContext } from "react";
import type { SupabaseContextType } from "./SupabaseContextTypes";

const SupabaseContext = createContext<SupabaseContextType | null>(null);
export default SupabaseContext;
