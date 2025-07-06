import { User } from "@/types";

// Enhanced types for better type safety
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (credentials: RegisterCredentials) => Promise<AuthResult>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
  reset: () => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface AuthContextType extends AuthState, AuthActions {}
