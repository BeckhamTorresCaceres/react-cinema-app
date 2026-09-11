import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../hooks/useAuthStore";
import { RegisterForm } from "../components/RegisterForm";
import type { RegisterFormValues } from "../types/auth.types";
import MagicRings from "@/components/MagicRings/MagicRings";

const INITIAL_VALUES: RegisterFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [formValues, setFormValues] = useState<RegisterFormValues>(INITIAL_VALUES);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // VALIDACIONES
    if (formValues.password !== formValues.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    if (formValues.password.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (!formValues.acceptTerms) {
      setErrorMessage("Debes aceptar los términos y condiciones.");
      return;
    }

    try {
      await register({
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        password: formValues.password,
      });

      setSuccessMessage("¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...");

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Ocurrió un error al crear la cuenta.");
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden bg-[#080616] px-6 py-12">
      <div className="absolute inset-0 z-0">
        <MagicRings color="#96c3f6" colorTwo="#3336e1" opacity={0.45} noiseAmount={0.03} speed={0.6} />
      </div>
      <div className="relative z-10 w-full max-w-lg animate-drop-from-sky rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/50 p-8 shadow-2xl backdrop-blur-md">
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

        <RegisterForm
          values={formValues}
          onChange={setFormValues}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      </div>
    </div>
  );
};
