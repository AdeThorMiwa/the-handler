import type { AuthState } from "@/types/context";
import { useState, useCallback, type FC, type PropsWithChildren } from "react";
import { AuthContext } from "./context";
import LocalStorageService from "@/services/storage";

const AUTH_KEY = "auth";
const ONBOARDED_KEY = "onboarded";

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => ({
    isAuthenticated: LocalStorageService.read<boolean>(AUTH_KEY, false),
    isOnboarded: LocalStorageService.read<boolean>(ONBOARDED_KEY, false),
  }));

  const login = useCallback(() => {
    LocalStorageService.write(AUTH_KEY, true);
    setState((s) => ({ ...s, isAuthenticated: true }));
  }, []);

  const completeOnboarding = useCallback(() => {
    LocalStorageService.write(ONBOARDED_KEY, true);
    setState((s) => ({ ...s, isOnboarded: true }));
  }, []);

  const logout = useCallback(() => {
    LocalStorageService.write(AUTH_KEY, false);
    LocalStorageService.write(ONBOARDED_KEY, false);
    setState({
      isAuthenticated: false,
      isOnboarded: false,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, completeOnboarding, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
