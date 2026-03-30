import type { UserContextValue } from "@/types/context";
import { createContext } from "react";

export const UserContext = createContext<UserContextValue | null>(null);
