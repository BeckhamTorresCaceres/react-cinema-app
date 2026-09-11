import { useState } from "react";
import { Link } from "react-router";
import type { RegisterFormValues } from "../types/auth.types";

interface RegisterFormProps {
  values: RegisterFormValues;
  onChange: (values: RegisterFormValues) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
}

/**
 * Nombre, apellido, correo, contraseña + confirmación (con toggle mostrar/ocultar),
 * aceptación de términos, botón con estado de carga y alertas de error/éxito.
 */
export const RegisterForm = ({
  values,
  onChange,
  onSubmit,
  isLoading,
  errorMessage,
  successMessage,
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...values,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <>
      {errorMessage && (
        <div className="mt-6 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-center text-sm text-red-400">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mt-6 rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-3 text-center text-sm text-emerald-400">
          {successMessage}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Nombre</label>
            <input
              type="text"
              name="firstName"
              required
              value={values.firstName}
              onChange={handleChange}
              placeholder="Juanito"
              className="w-full rounded-lg border border-[#162E93]/60 bg-[#080616]/70 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-[#2F2FE4]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Apellido</label>
            <input
              type="text"
              name="lastName"
              required
              value={values.lastName}
              onChange={handleChange}
              placeholder="Alimaña"
              className="w-full rounded-lg border border-[#162E93]/60 bg-[#080616]/70 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-[#2F2FE4]"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Correo electrónico</label>
          <input
            type="email"
            name="email"
            required
            value={values.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            className="w-full rounded-lg border border-[#162E93]/60 bg-[#080616]/70 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-[#2F2FE4]"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={values.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#162E93]/60 bg-[#080616]/70 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-[#2F2FE4]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Confirmar Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              required
              value={values.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#162E93]/60 bg-[#080616]/70 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-[#2F2FE4]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-xs text-slate-400 hover:text-white"
          >
            {showPassword ? "Ocultar contraseñas" : "Mostrar contraseñas"}
          </button>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            name="acceptTerms"
            id="acceptTerms"
            checked={values.acceptTerms}
            onChange={handleChange}
            className="h-4 w-4 rounded border-[#162E93] bg-[#080616] text-[#2F2FE4]"
          />
          <label htmlFor="acceptTerms" className="text-xs text-slate-300">
            Acepto los términos y condiciones y la política de privacidad.
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-[#2F2FE4] py-3 font-semibold text-white shadow-lg transition duration-200 hover:bg-[#162E93] disabled:opacity-50"
        >
          {isLoading ? "Creando cuenta..." : "Registrarse"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login" className="font-semibold text-[#2F2FE4] hover:underline">
          Inicia sesión aquí
        </Link>
      </p>
    </>
  );
};
