// Guardar el token de acceso, la información del usuario logueado y el estado isAuthenticated para todo el proyecto
import { create } from 'zustand';
import type { User, LoginCredentials, RegisterCredentials } from '../../../shared/interfaces/auth.interface';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>; // <-- Agregada coma al final
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });
    try {
      // Simulación de una llamada a la API para autenticar al usuario
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
      const mockUser = { id: "1", email: credentials.email, name: "Usuario Lumi" };

      if (credentials.rememberMe) {
        localStorage.setItem('token', mockToken);
      }

      set({
        token: mockToken,
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw new Error("Credenciales inválidas o cuenta inactiva");
    }
  },

  // Lógica de Registro
  register: async (credentials: RegisterCredentials) => {
    set({ isLoading: true });
    try {
      // Aquí irá la llamada al backend: POST /api/v1/auth/register
      // Simulamos la respuesta del backend:
      await new Promise((resolve) => setTimeout(resolve, 1500));

      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw new Error("El correo ya se encuentra registrado.");
    }
  }, 
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));