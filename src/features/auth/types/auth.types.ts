import type { ServerUser } from "@/features/users/types/user.types";

export interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatar?: string;
  role?: string;
  isVerified?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/** Valores controlados por el formulario de login (UI), no confundir con LoginCredentials. */
export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

/** Valores controlados por el formulario de registro (UI), incluye campos que no van al backend. */
export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export type RawAuthUser = Omit<ServerUser, "role"> & {
  role?: { name?: string } | string | number;
};

export type LoginResult =
  | { success: true; user: Record<string, unknown> }
  | { success: false; message: string };

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  refreshProfile: () => Promise<void>;
  logout: () => void;
}
