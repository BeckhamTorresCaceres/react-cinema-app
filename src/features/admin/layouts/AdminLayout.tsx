import { Outlet, NavLink, Link, useNavigate } from "react-router";
import { useAuthStore } from "../../auth/store/authStore";

export const AdminLayout = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#080616] text-white">
      <aside className="border-b border-[#162E93]/40 bg-[#1A1953]/70 p-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2F2FE4]">Lumi Films</p>
            <h1 className="text-xl font-bold">Panel Admin</h1>
          </div>
          <nav className="flex gap-3 text-sm items-center">
            <NavLink to="/admin" className={({ isActive }) => `rounded px-3 py-2 ${isActive ? "bg-[#2F2FE4]" : "bg-[#080616]/60"}`}>
              Inicio
            </NavLink>
            <Link to="/admin/perfil" className="flex items-center gap-2 rounded-full border border-[#162E93] bg-[#1A1953]/50 px-3 py-2 text-sm font-medium text-white transition hover:border-[#2F2FE4]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2F2FE4]">A</div>
              <span>{user?.name || user?.email}</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded bg-[#080616]/60 px-3 py-2"
            >
              Cerrar sesión
            </button>
          </nav>
        </div>
      </aside>

      <main className="mx-auto max-w-6xl p-6">
        <Outlet />
      </main>
    </div>
  );
};
