import type { AuthState } from "@/types/context";
import { useState, useCallback, type FC, type PropsWithChildren } from "react";
import { AuthContext } from "./context";

// ── Storage keys ──────────────────────────────────────────────────────────────

const AUTH_KEY = "career-os:auth";
const ONBOARDED_KEY = "career-os:onboarded";

function readBool(key: string): boolean {
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

function writeBool(key: string, value: boolean) {
  try {
    if (value) {
      localStorage.setItem(key, "true");
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    /* ignore storage errors */
  }
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => ({
    isAuthenticated: readBool(AUTH_KEY),
    isOnboarded: readBool(ONBOARDED_KEY),
  }));

  const login = useCallback(() => {
    writeBool(AUTH_KEY, true);
    setState((s) => ({ ...s, isAuthenticated: true }));
  }, []);

  const completeOnboarding = useCallback(() => {
    writeBool(ONBOARDED_KEY, true);
    setState((s) => ({ ...s, isOnboarded: true }));
  }, []);

  const logout = useCallback(() => {
    writeBool(AUTH_KEY, false);
    writeBool(ONBOARDED_KEY, false);
    setState({ isAuthenticated: false, isOnboarded: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, completeOnboarding, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
