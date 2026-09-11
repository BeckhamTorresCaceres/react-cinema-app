import { getUsersByEmail } from "@/features/users/services/userService";

import type { RawAuthUser } from "../types/auth.types";
export type { RawAuthUser } from "../types/auth.types";

export async function fetchUserByEmail(email: string): Promise<RawAuthUser[]> {
  const normalizedEmail = email.toLowerCase().trim();
  const users = await getUsersByEmail(normalizedEmail);
  return users as RawAuthUser[];
}
