import { useEffect, useState } from "react";
import { getUsers, updateUser } from "@/features/users/services/userService";
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
        roleId: Number(user.roleId ?? 2),
        avatar: user.avatar,
      })),
    );
  };

  useEffect(() => {
    getUsers()
      .then(normalizeUsers)
      .catch((error: unknown) => console.error("Error al cargar usuarios:", error))
      .finally(() => setLoading(false));
  }, []);

  // Cambiar rol de usuario en db.json (1 = Admin, 2 = Cliente)
  const handleRoleChange = async (userId: string | number, newRoleId: number) => {
    try {
      await updateUser(userId, { roleId: newRoleId });

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, roleId: newRoleId } : u))
      );
    } catch (err) {
      console.error("Error al actualizar rol:", err);
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
