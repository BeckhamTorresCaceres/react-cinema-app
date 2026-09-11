// Guardar el token de acceso, la información del usuario logueado y el estado isAuthenticated para todo el proyecto
import { create } from "zustand";
import type { User, LoginCredentials, RegisterCredentials } from "../types/auth.types";
import { fetchUserByEmail } from "../services/userAuthService";
import type { RawAuthUser } from "../types/auth.types";
import { createUser, getUserById } from "@/features/users/services/userService";
import { useCartStore } from "@/features/confiteria/hooks/useCartStore";

import type { AuthState } from "../types/auth.types";
const normalizeUser = (user: RawAuthUser): User => ({
  id: String(user.id ?? ""),
  email: user.email ?? "",
  name: user.name || user.username,
  username: user.username,
  avatar: user.avatar,
  role: typeof user.role === "object" && user.role !== null ? user.role.name : Number(user.roleId) === 1 ? "admin" : "client",
  isVerified: Boolean(user.active),
});

const persistUser = (user: User) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch {
    // ignore storage errors
  }
};

const readStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<User>;
    if (!parsed?.id) return null;

    return {
      id: String(parsed.id),
      email: String(parsed.email ?? ""),
      name: parsed.name,
      username: parsed.username,
      avatar: parsed.avatar,
      role: parsed.role,
      isVerified: parsed.isVerified,
    };
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: readStoredUser(),
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });
    try {
      const users = await fetchUserByEmail(credentials.email);
      const user = users[0];

      if (!user || user.password !== credentials.password) {
        throw new Error("Credenciales inválidas o cuenta inactiva");
      }

      if (!user.active) {
        throw new Error("Credenciales inválidas o cuenta inactiva");
      }

      const token = `mock-token-${user.id}`;
      const normalizedUser = normalizeUser(user);

      localStorage.setItem("token", token);
      persistUser(normalizedUser);
      useCartStore.getState().setUserScope(normalizedUser.id);

      set({
        token,
        user: normalizedUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw new Error(
        error instanceof Error ? error.message : "Credenciales inválidas o cuenta inactiva",
        { cause: error },
      );
    }
  },

  register: async (credentials: RegisterCredentials) => {
    set({ isLoading: true });
    try {
      const existing = await fetchUserByEmail(credentials.email);
      if (existing.length > 0) {
        throw new Error("El correo ya se encuentra registrado.");
      }

      const normalizedEmail = credentials.email.toLowerCase().trim();
      await createUser({
        name: `${credentials.firstName} ${credentials.lastName}`.trim(),
        email: normalizedEmail,
        password: credentials.password,
        roleId: "2", // cliente
        active: true,
      });

      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw new Error(
        error instanceof Error ? error.message : "El correo ya se encuentra registrado.",
        { cause: error },
      );
    }
  },

  refreshProfile: async () => {
    const current = get().user;
    if (!current?.id) return;

    const fullUser = await getUserById(current.id);
    const nextUser: User = {
      ...current,
      name: fullUser.name || current.name,
      username: fullUser.username || current.username,
      email: fullUser.email || current.email,
      avatar: fullUser.avatar || current.avatar,
      role: Number(fullUser.roleId) === 1 ? "admin" : Number(fullUser.roleId) === 2 ? "client" : current.role,
    };

    persistUser(nextUser);
    set({ user: nextUser });
  },

  logout: () => {
    useCartStore.getState().clear();
    useCartStore.getState().setUserScope(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
