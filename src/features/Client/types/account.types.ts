import type { ServerUser } from "@/features/users/types/user.types";

/**
 * Vista de ServerUser usada en "Mi Cuenta": todos los campos que
 * el formulario necesita quedan garantizados (no opcionales) tras el
 * mapeo que hace MyAccount.tsx al recibir el ServerUser crudo.
 */
export interface AccountUser
  extends Required<
    Pick<
      ServerUser,
      | "id"
      | "name"
      | "username"
      | "email"
      | "phone"
      | "avatar"
      | "membershipId"
      | "memberSince"
      | "expiryDate"
    >
  > {
  id: number;
  status: "ACTIVO" | "INACTIVO";
}
