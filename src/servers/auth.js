import { API_URL } from "./api.js";

export const AUTH_ERRORS = {
    MISING_FIELDS: "Please enter your email and password.",
    INVALID_CREDENTIALS: "Incorrect email or password.",
    ACCOUNT_INNACTIVE: "Your account is inactive. Please contact the administrator.",
    NETWORK_ERROR: "Could not connect to the server. Please check your internet connection and try again.",
    SERVER_ERROR: "Server error. Please try again later."
};

export async function loginUser(email, password) {
    if (!email || !password) {
        return { success: false, message: AUTH_ERRORS.MISING_FIELDS };   
    }

    let response;
    try {
        response = await fetch(`${API_URL}/users?email=${email}`);
    } catch (error) {
        return { success: false, message: AUTH_ERRORS.NETWORK_ERROR };
    }

    if (!response.ok) {
        return { success: false, message: AUTH_ERRORS.SERVER_ERROR };
    }

    const users = await response.json();
    const user = users[0];

    if (!user || user.password !== password) {
        return { success: false, message: AUTH_ERRORS.INVALID_CREDENTIALS };
    }

    if (!user.active) {
        return { success: false, message: AUTH_ERRORS.ACCOUNT_INNACTIVE };
    }

    const safeUser = { ...user };
    delete safeUser.password;

    return { success: true, user: safeUser };

}
