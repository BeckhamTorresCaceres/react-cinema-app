// Guardar el token de acceso, la información del usuario logueado y el estado isAuthenticated para todo el proyecto
import { create } from 'zustand';
import type { User, LoginCredentials, RegisterCredentials } from '../../../shared/interfaces/auth.interface';
import { fetchUserByEmail, type RawAuthUser } from '../../../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const normalizeUser = (user: RawAuthUser): User => ({
  id: String(user.id ?? ''),
  email: user.email ?? '',
  name: user.name || user.username,
  role: typeof user.role === 'object' && user.role !== null ? user.role.name : user.roleId === 1 ? 'admin' : 'client',
  isVerified: Boolean(user.active),
});

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });
    try {
      const users = await fetchUserByEmail(credentials.email);
      const user = users[0];

      if (!user || user.password !== credentials.password) {
        throw new Error('Credenciales inválidas o cuenta inactiva');
      }

      if (!user.active) {
        throw new Error('Credenciales inválidas o cuenta inactiva');
      }

      const token = `mock-token-${user.id}`;
      const normalizedUser = normalizeUser(user);

      localStorage.setItem('token', token);
      try {
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      } catch {
        // ignore storage errors
      }

      set({
        token,
        user: normalizedUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw new Error((error as Error).message || 'Credenciales inválidas o cuenta inactiva');
    }
  },

  register: async (_credentials: RegisterCredentials) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      set({ isLoading: false });
    } catch {
      set({ isLoading: false });
      throw new Error('El correo ya se encuentra registrado.');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));