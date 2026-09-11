import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../hooks/useAuthStore";
import { LoginForm } from "../components/LoginForm";
import type { LoginFormValues } from "../types/auth.types";
import StrokeText from "@/components/StrokeText/StrokeText";
import DriftWall from "@/components/DriftWall/DriftWall";
import type { DriftWallItem } from "@/components/DriftWall/DriftWall";
import { getMovies } from "@/features/billboard/services/billboardService";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<LoginFormValues>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [driftItems, setDriftItems] = useState<DriftWallItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadMovies = async () => {
      try {
        const movies = await getMovies();
        if (isMounted) {
          setDriftItems(
            movies.map((movie) => ({
              image: movie.poster,
              title: movie.title,
              description: `${movie.genre} · ${movie.duration} min`,
            }))
          );
        }
      } catch {
        // El fondo es decorativo; el formulario de acceso permanece disponible.
      }
    };

    void loadMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await login(formValues);
      const { user } = useAuthStore.getState();
      const from = location.state?.from as { pathname?: string; search?: string; hash?: string } | undefined;
      const destination = from?.pathname ? `${from.pathname}${from.search ?? ""}${from.hash ?? ""}` : user?.role === "admin" ? "/admin" : "/";
      navigate(destination, { replace: true });
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudo iniciar sesión"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Color palet
  // #080616, #1A1953, #162E93, #2F2FE4

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080616] px-6 py-12">
      <div className="absolute inset-0 z-0">
        <DriftWall
          items={driftItems}
          columns={5}
          tileWidth={170}
          tileHeight={255}
          gap={18}
          fade={0.7}
          speed={10}
          turn={-22}
          depth={90}
          direction="up"
          overlayColor="#080616"
        />
      </div>
      <div className="relative z-10 w-full max-w-md animate-drop-from-sky rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/50 p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center">
          <div className="mt-1 flex items-center justify-center" role="heading" aria-level={1}>
            <StrokeText
              text="Lumi"
              strokeColor="#FFFFFF"
              fillColor="#FFFFFF"
              strokeWidth={1.2}
              drawDuration={1.2}
              fillDelay={0.15}
              stagger={0.05}
              ease="power2.out"
              trigger="mount"
              fillMode="wipe"
              fontSize={36}
              fontWeight={800}
              letterSpacing={-0.9}
              className="[&_.stroke-text__svg]:w-auto"
              style={{ display: "inline-block", width: "auto" }}
            />
            <StrokeText
              text="Films"
              strokeColor="#2F2FE4"
              fillColor="#2F2FE4"
              strokeWidth={1.2}
              drawDuration={1.2}
              fillDelay={0.15}
              stagger={0.05}
              ease="power2.out"
              trigger="mount"
              fillMode="wipe"
              fontSize={36}
              fontWeight={800}
              letterSpacing={-0.9}
              className="[&_.stroke-text__svg]:w-auto"
              style={{ display: "inline-block", width: "auto" }}
            />
          </div>
          <p className="mt-2 text-sm text-slate-300">
            Ingresa a tu cuenta para gestionar tus entradas
          </p>
        </div>

        <LoginForm
          values={formValues}
          onChange={setFormValues}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
};
