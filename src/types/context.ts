export interface AuthState {
  isAuthenticated: boolean;
  isOnboarded: boolean;
}

export interface AuthContextValue extends AuthState {
  login: () => void;
  completeOnboarding: () => void;
  logout: () => void;
}
