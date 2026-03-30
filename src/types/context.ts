import type { UserPreference } from "@/services/preference";

export interface AuthState {
  isAuthenticated: boolean;
  isOnboarded: boolean;
}

export interface AuthContextValue extends AuthState {
  login: () => void;
  completeOnboarding: () => void;
  logout: () => void;
}

export interface UserState {
  username: string;
  email: string;
  preference?: UserPreference;
  directories: string[];
}

export interface UserContextValue extends UserState {
  setPreference(preference: UserPreference): void;
  setDirectories(directories: string[]): void;
}
