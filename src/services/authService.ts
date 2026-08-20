import { getUsersByEmail } from "./users";

export type RawAuthUser = {
  id?: string | number;
  email?: string;
  password?: string;
  name?: string;
  username?: string;
  avatar?: string;
  active?: boolean;
  role?: {
    name?: string;
  } | string | number;
  roleId?: number;
};

export async function fetchUserByEmail(email: string): Promise<RawAuthUser[]> {
  const users = await getUsersByEmail(email);
  return users as RawAuthUser[];
}
