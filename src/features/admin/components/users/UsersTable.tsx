import { Shield, UserCheck, Mail } from "lucide-react";
import type { AdminUser } from "../../types/admin.types";

interface UsersTableProps {
  users: AdminUser[];
  onRoleChange: (userId: string | number, newRoleId: string) => void;
}

export const UsersTable = ({ users, onRoleChange }: UsersTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/20">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="border-b border-[#162E93]/40 bg-[#080616]/60 text-xs uppercase text-slate-400">
          <tr>
            <th className="px-6 py-4">Usuario</th>
            <th className="px-6 py-4">Correo Electrónico</th>
            <th className="px-6 py-4">Rol Actual</th>
            <th className="px-6 py-4 text-right">Acción / Cambiar Rol</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#162E93]/20">
          {users.map((user) => (
            <tr key={user.id} className="transition hover:bg-[#1A1953]/40">
              <td className="px-6 py-4 font-semibold text-white flex items-center gap-3">
                <img
                  src={user.avatar || "https://i.pravatar.cc/150"}
                  alt={user.name}
                  className="h-8 w-8 rounded-full border border-[#2F2FE4] object-cover"
                />
                <span>{user.name}</span>
              </td>
              <td className="px-6 py-4 text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail size={14} /> {user.email}
                </span>
              </td>
              <td className="px-6 py-4">
                {Number(user.roleId) === 1 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-400 border border-purple-500/20">
                    <Shield size={12} /> Administrador
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
                    <UserCheck size={12} /> Cliente
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <select
                  value={user.roleId}
                  onChange={(e) => onRoleChange(user.id, e.target.value)}
                  className="rounded-xl border border-[#162E93] bg-[#080616] px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-[#2F2FE4]"
                >
                  <option value={2}>Cliente</option>
                  <option value={1}>Administrador</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
