import { getUsersByEmail, type ServerUser } from "./users";

export const AUTH_ERRORS = {
  MISING_FIELDS: "Please enter your email and password.",
  INVALID_CREDENTIALS: "Incorrect email or password.",
  ACCOUNT_INNACTIVE: "Your account is inactive. Please contact the administrator.",
  NETWORK_ERROR: "Could not connect to the server. Please check your internet connection and try again.",
  SERVER_ERROR: "Server error. Please try again later.",
} as const;

type LoginResult =
  | { success: true; user: Record<string, unknown> }
  | { success: false; message: string };

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  if (!email || !password) {
    return { success: false, message: AUTH_ERRORS.MISING_FIELDS };
  }

  let users: ServerUser[];
  try {
    users = await getUsersByEmail(email);
  } catch {
    return { success: false, message: AUTH_ERRORS.NETWORK_ERROR };
  }

  const user = users[0];

  if (!user || user.password !== password) {
    return { success: false, message: AUTH_ERRORS.INVALID_CREDENTIALS };
  }

  if (!user.active) {
    return { success: false, message: AUTH_ERRORS.ACCOUNT_INNACTIVE };
  }

  const safeUser: Record<string, unknown> = { ...user };
  delete safeUser.password;

  return { success: true, user: safeUser };
}
