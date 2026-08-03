import { Outlet, Link, useLocation } from "react-router";

export const AuthLayout = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-[#080616] text-white">
      {/* Navbar Superior */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#162E93]/30 bg-[#080616]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-wide text-white transition hover:opacity-90"
          >
            Lumi<span className="text-[#2F2FE4]">Films</span>
          </Link>

          {/* Botones de Navegación del Header */}
          <div className="flex items-center gap-3">
            {location.pathname !== "/login" && (
              <Link
                to="/login"
                className="rounded-lg border border-[#162E93] bg-[#1A1953]/40 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:border-[#2F2FE4] hover:bg-[#162E93]/50"
              >
                Iniciar sesión
              </Link>
            )}

            {location.pathname !== "/register" && (
              <Link
                to="/register"
                className="rounded-lg bg-[#2F2FE4] px-4 py-2 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-[#162E93]"
              >
                Registrarse
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Contenido Dinámico (LoginPage / RegisterPage / etc.) */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Footer Inferior */}
      <footer className="border-t border-[#162E93]/30 bg-[#080616] py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-xs text-slate-400 md:flex-row">
          <p>
            © {new Date().getFullYear()} <span className="font-semibold text-slate-200">Lumi Films</span>. Todos los derechos reservados.
          </p>

          <div className="flex gap-6">
            <Link to="/privacy" className="transition hover:text-[#2F2FE4]">
              Privacidad
            </Link>

            <Link to="/terms" className="transition hover:text-[#2F2FE4]">
              Términos
            </Link>

            <Link to="/contact" className="transition hover:text-[#2F2FE4]">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};