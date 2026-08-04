import { useNavigate } from "react-router";
import { useAuthStore } from "../../auth/store/authStore";

export const AdminPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#080616] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/50 p-8 shadow-2xl backdrop-blur-md">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2F2FE4]">
          Panel administrativo
        </p>
        <h1 className="mt-3 text-3xl font-bold">
          Bienvenido, {user?.name || user?.email}
        </h1>
        <p className="mt-3 text-slate-300">
          Aquí podrás gestionar usuarios, películas y reservas desde la administración.
        </p>

        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-[#162E93]/60 bg-[#080616]/70 px-4 py-2 font-semibold text-white transition hover:bg-[#162E93]"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};
