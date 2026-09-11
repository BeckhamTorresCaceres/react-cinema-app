import type { ServerUser } from "@/features/users/types/user.types";

/**
 * Vista de ServerUser usada por el panel de administración:
 * id/name/email siempre presentes (normalizados al cargar la lista),
 * roleId siempre numérico, el resto queda igual que en el servidor.
 */
export interface AdminUser extends Required<Pick<ServerUser, "id" | "name" | "email" | "roleId">>,
  Omit<ServerUser, "id" | "name" | "email" | "roleId"> {}

/** Valores controlados por el formulario de crear/editar película (UI). */
export interface MovieFormValues {
  title: string;
  poster: string;
  trailer: string;
  genre: string;
  rating: string;
  duration: number;
  director: string;
  score: number;
}
