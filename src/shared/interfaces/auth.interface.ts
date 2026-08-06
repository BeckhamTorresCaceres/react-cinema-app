// Definir las estructuras TypeScript para LoginCredentials, AuthResponse y User.

export interface User {
    id: string;
    email: string;
    name?: string;
    username?: string;
    role?: string;
    isVerified?: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterCredentials {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}