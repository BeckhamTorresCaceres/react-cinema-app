import { Outlet, Link } from "react-router";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold   tracking-wide text-red-600"
          >
            ClassFilms
          </Link>
          {/* Botones */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg border border-white/20 px-4 py-2 transition hover:bg-white/10"
            >
              Iniciar sesión
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-red-600 px-4 py-2 font-semibold transition hover:bg-red-700"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-zinc-950 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-gray-400 md:flex-row">
          <p>© {new Date().getFullYear()} Cinema. Todos los derechos reservados.</p>

          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white">
              Privacidad
            </Link>

            <Link to="/terms" className="hover:text-white">
              Términos
            </Link>

            <Link to="/contact" className="hover:text-white">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};