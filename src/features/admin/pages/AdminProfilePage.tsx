import { useAuthStore } from "../../auth/store/authStore";

export const AdminProfilePage = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#080616] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/50 p-8 shadow-2xl backdrop-blur-md">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2F2FE4]">
          Perfil de Administrador
        </p>
        <h1 className="mt-4 text-3xl font-bold">{user?.name || user?.email}</h1>
        <p className="mt-3 text-slate-300">Correo: {user?.email}</p>
        <p className="mt-1 text-slate-300">Rol: {user?.role}</p>
        <section className="mt-8 rounded-2xl bg-[#080616]/80 p-6 border border-[#2F2FE4]/20">
          <h2 className="text-xl font-semibold text-white">Información de la cuenta</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-400">Nombre</p>
              <p className="mt-1 text-white">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Email</p>
              <p className="mt-1 text-white">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Usuario</p>
              <p className="mt-1 text-white">{user?.username}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
