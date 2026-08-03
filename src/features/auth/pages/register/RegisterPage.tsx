import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../store/authStore";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // VALIDACIONES
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (!formData.acceptTerms) {
      setErrorMessage("Debes aceptar los términos y condiciones.");
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      setSuccessMessage("¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...");
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message || "Ocurrió un error al crear la cuenta.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-[#080616] px-6 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/50 p-8 shadow-2xl backdrop-blur-md">
        
        {/* Encabezado */}
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-[#2F2FE4]">
            Únete a la comunidad
          </span>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-white">
            Crea tu cuenta
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Disfruta de beneficios, reserva tus entradas y vive la experiencia Lumi Films
          </p>
        </div>

        {/* Mensaje de Error */}
        {errorMessage && (
          <div className="mt-6 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-center text-sm text-red-400">
            {errorMessage}
          </div>
        )}

        {/* Mensaje de Éxito */}
        {successMessage && (
          <div className="mt-6 rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-3 text-center text-sm text-emerald-400">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Nombres y Apellidos */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Nombre</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
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
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Alimaña"
                className="w-full rounded-lg border border-[#162E93]/60 bg-[#080616]/70 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-[#2F2FE4]"
              />
            </div>
          </div>

          {/* Correo */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Correo electrónico</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className="w-full rounded-lg border border-[#162E93]/60 bg-[#080616]/70 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-[#2F2FE4]"
            />
          </div>

          {/* Contraseñas */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Contraseña</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
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
                value={formData.confirmPassword}
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

          {/* Términos */}
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              name="acceptTerms"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="h-4 w-4 rounded border-[#162E93] bg-[#080616] text-[#2F2FE4]"
            />
            <label htmlFor="acceptTerms" className="text-xs text-slate-300">
              Acepto los términos y condiciones y la política de privacidad.
            </label>
          </div>

          {/* Botón */}
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
      </div>
    </div>
  );
};