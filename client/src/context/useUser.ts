// Exports the custom hook for using the context
import { useContext } from "react";
import UserContext from "./UserContext";

export const useUser = () => useContext(UserContext);
