// Declares the context object only
import { createContext } from "react";
import type { UserContextType } from "../types/UserInfo";

const UserContext = createContext<UserContextType | undefined>(undefined);
export default UserContext;
