import { useEffect, useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router";
import { useAuthStore } from "../../auth/store/authStore";
import { Clapperboard, LayoutDashboard, Film, Users, ExternalLink, LogOut, Popcorn } from "lucide-react";
import { getAvatarUrl } from "@/shared/utils/avatar";

export const AdminLayout = () => {
  const { logout, user, refreshProfile } = useAuthStore();
  const navigate = useNavigate();
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const avatarSrc = avatarFailed
    ? getAvatarUrl(undefined, user?.name)
    : getAvatarUrl(user?.avatar, user?.name);

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
    { label: "Películas", path: "/admin/movies", icon: Film, end: false },
    { label: "Confitería", path: "/admin/confiteria", icon: Popcorn, end: false },
    { label: "Usuarios", path: "/admin/users", icon: Users, end: false },
  ];

  return (
    <div className="flex min-h-screen bg-[#080616] text-white">
      {/* SIDEBAR */}
      <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-[#162E93]/40 bg-[#080616] p-4">
        {/* Brand */}
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F2FE4] shadow-lg shadow-[#2F2FE4]/30">
            <Clapperboard className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8E8EFF]">Lumi Films</p>
            <h1 className="text-lg font-extrabold text-white">Panel Admin</h1>
          </div>
        </div>

        {/* Botón Ir a la Plataforma Pública */}
        <Link
          to="/"
          className="mb-6 flex items-center justify-between rounded-xl border border-[#162E93]/60 bg-[#1A1953]/30 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-[#2F2FE4] hover:text-white"
        >
          <span>Ver Plataforma</span>
          <ExternalLink size={14} className="text-[#8E8EFF]" />
        </Link>

        {/* Rutas Principales */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#2F2FE4] text-white shadow-md shadow-[#2F2FE4]/30"
                      : "text-slate-400 hover:bg-[#1A1953]/50 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer del Sidebar */}
        <div className="border-t border-[#162E93]/40 pt-4 space-y-2">
          <Link
            to="/admin/perfil"
            className="flex items-center gap-3 rounded-xl border border-[#162E93]/60 bg-[#1A1953]/30 p-2.5 transition hover:border-[#2F2FE4]"
          >
            <img
              src={avatarSrc}
              alt={user?.name || "Avatar"}
              onError={() => setAvatarFailed(true)}
              className="h-8 w-8 rounded-full object-cover border border-[#2F2FE4]"
            />
            <div className="truncate text-xs">
              <p className="font-semibold text-white truncate">{user?.name || "Administrador"}</p>
              <p className="text-slate-400 truncate text-[10px]">{user?.email}</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};