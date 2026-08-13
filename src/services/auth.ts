import { API_URL, type ServerUser } from "./api";
import { endpoints } from "./endpoints";

export const AUTH_ERRORS = {
    MISING_FIELDS: "Please enter your email and password.",
    INVALID_CREDENTIALS: "Incorrect email or password.",
    ACCOUNT_INNACTIVE: "Your account is inactive. Please contact the administrator.",
    NETWORK_ERROR: "Could not connect to the server. Please check your internet connection and try again.",
    SERVER_ERROR: "Server error. Please try again later."
} as const;

type LoginResult =
    | { success: true; user: Record<string, unknown> }
    | { success: false; message: string };

export async function loginUser(email: string, password: string): Promise<LoginResult> {
    if (!email || !password) {
        return { success: false, message: AUTH_ERRORS.MISING_FIELDS };
    }

    let response: Response;
    try {
        response = await fetch(`${API_URL}${endpoints.usersByEmail(email)}`);
    } catch {
        return { success: false, message: AUTH_ERRORS.NETWORK_ERROR };
    }

    if (!response.ok) {
        return { success: false, message: AUTH_ERRORS.SERVER_ERROR };
    }

    const users = (await response.json()) as ServerUser[];
    const user = users[0] as ServerUser | undefined;

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
