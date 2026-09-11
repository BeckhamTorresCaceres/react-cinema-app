import { useState } from "react";
import { Link } from "react-router";
import type { LoginFormValues } from "../types/auth.types";

interface LoginFormProps {
  values: LoginFormValues;
  onChange: (values: LoginFormValues) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  errorMessage: string | null;
}

/**
 * Inputs de correo/usuario, contraseña, botón con estado de carga (isSubmitting),
 * botón para mostrar/ocultar contraseña y alerta de errores.
 */
export const LoginForm = ({ values, onChange, onSubmit, isLoading, errorMessage }: LoginFormProps) => {
  const { email, password, rememberMe } = values;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {errorMessage && (
        <div className="mt-6 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-center text-sm text-red-400">
          {errorMessage}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Correo electrónico
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => onChange({ ...values, email: e.target.value })}
            placeholder="correo@ejemplo.com"
            className="w-full rounded-lg border border-[#162E93]/60 bg-[#080616]/70 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-[#2F2FE4] focus:ring-2 focus:ring-[#2F2FE4]/30"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-200">Contraseña</label>
            <Link to="/forgot-password" className="text-xs text-slate-400 hover:text-white">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => onChange({ ...values, password: e.target.value })}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#162E93]/60 bg-[#080616]/70 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-[#2F2FE4] focus:ring-2 focus:ring-[#2F2FE4]/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => onChange({ ...values, rememberMe: e.target.checked })}
            className="h-4 w-4 rounded border-[#162E93] bg-[#080616] text-[#2F2FE4] focus:ring-[#2F2FE4]"
          />
          <label htmlFor="remember" className="text-xs text-slate-300">
            Recordarme en este dispositivo
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-[#2F2FE4] py-3 font-semibold text-white shadow-lg transition duration-200 hover:bg-[#162E93] disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Iniciando sesión...
            </span>
          ) : (
            "Iniciar Sesión"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="font-semibold text-[#2F2FE4] hover:underline">
          Regístrate aquí
        </Link>
      </p>
    </>
  );
};
