import type { AuthContextValue } from "@/types/context";
import { createContext } from "react";

export const AuthContext = createContext<AuthContextValue | null>(null);
