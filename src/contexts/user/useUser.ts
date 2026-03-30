import type { UserContextValue } from "@/types/context";
import { useContext } from "react";
import { UserContext } from "./context";

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within <UserProvider>");
  }
  return ctx;
}
