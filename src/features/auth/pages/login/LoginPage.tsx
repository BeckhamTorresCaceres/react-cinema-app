import { Link } from "react-router";

export const LoginPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-black px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur">
        <h1 className="text-center text-3xl font-bold text-white">
          Iniciar Sesión
        </h1>

        <p className="mt-2 text-center text-gray-400">
          Bienvenido de nuevo.
        </p>

        <form className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="correo@ejemplo.com"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Contraseña
            </label>

            <input
              type="password"
              placeholder="********"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-red-600 py-3 font-semibold transition hover:bg-red-700"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="font-semibold text-red-500 hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};