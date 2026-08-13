import { API_URL } from "./api";
import { endpoints } from "./endpoints";

export type RawAuthUser = {
  id?: string | number;
  email?: string;
  password?: string;
  name?: string;
  username?: string;
  active?: boolean;
  role?: {
    name?: string;
  } | string | number;
  roleId?: number;
};

export async function fetchUserByEmail(email: string): Promise<RawAuthUser[]> {
  const response = await fetch(`${API_URL}${endpoints.usersByEmail(email)}`);

  if (!response.ok) {
    throw new Error("Error de conexión");
  }

  return (await response.json()) as RawAuthUser[];
}
