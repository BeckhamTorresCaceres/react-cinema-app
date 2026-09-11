import { useEffect, useState } from "react";
import { getUsers, updateUser } from "@/features/users/services/userService";
import { useAuthStore } from "@/features/auth/hooks/useAuthStore";
import { UsersTable } from "../components/users/UsersTable";

import type { AdminUser } from "../types/admin.types";
export const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const normalizeUsers = (data: Awaited<ReturnType<typeof getUsers>>) => {
    setUsers(
      data.map((user) => ({
        id: String(user.id ?? ""),
        name: String(user.name ?? user.username ?? ""),
        email: String(user.email ?? ""),
        roleId: String(user.roleId ?? "2"),
        avatar: user.avatar,
        active: user.active !== false,
      })),
    );
  };

  useEffect(() => {
    getUsers()
      .then(normalizeUsers)
      .catch((error: unknown) => console.error("Error al cargar usuarios:", error))
      .finally(() => setLoading(false));
  }, []);

  // Cambiar rol de usuario en db.json ("1" = Admin, "2" = Cliente)
  const handleRoleChange = async (userId: string | number, newRoleId: string) => {
    const targetId = String(userId);
    const currentUser = useAuthStore.getState().user;
    const currentTarget = users.find((u) => String(u.id) === targetId);

    if (!currentTarget || String(currentTarget.roleId) === newRoleId) return;

    if (currentUser?.id === targetId && newRoleId === "2") {
      const activeAdmins = users.filter((u) => String(u.roleId) === "1" && u.active !== false);
      if (activeAdmins.length <= 1) {
        window.alert("No puedes quitarte el rol de administrador porque eres el último administrador.");
        return;
      }
      if (!window.confirm("¿Seguro que quieres cambiar tu propia cuenta a Cliente? Perderás el acceso al panel de administración.")) return;
    }

    try {
      await updateUser(userId, { roleId: newRoleId });
      setUsers((prev) => prev.map((u) => (String(u.id) === targetId ? { ...u, roleId: newRoleId } : u)));
      if (currentUser?.id === targetId && newRoleId === "2") {
        useAuthStore.getState().logout();
      }
    } catch (err) {
      console.error("Error al actualizar rol:", err);
      window.alert("No fue posible actualizar el rol. Inténtalo de nuevo.");
    }
  };

  if (loading) return <div className="text-slate-400">Cargando lista de usuarios...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Gestión de Usuarios</h1>
        <p className="mt-1 text-sm text-slate-400">
          Administra los permisos y roles de los usuarios registrados
        </p>
      </div>

      <UsersTable users={users} onRoleChange={handleRoleChange} />
    </div>
  );
};
