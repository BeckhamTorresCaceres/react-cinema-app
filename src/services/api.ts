import { endpoints } from "./endpoints";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export type ServerUser = Record<string, unknown> & {
    id?: string | number;
    active?: boolean;
    password?: string;
};

export interface CinemaLocation {
    id: string;
    nombre: string;
    direccion: string;
    salasCount: number;
}

export interface CityLocation {
    id: string;
    nombre: string;
    cines: CinemaLocation[];
}

export interface DepartmentLocation {
    id: string;
    nombre: string;
    ciudades: CityLocation[];
}

export interface CountryLocation {
    id: string;
    nombre: string;
    departamentos: DepartmentLocation[];
}

function buildUrl(path: string): string {
    return `${API_URL}${path}`;
}

export async function getLocations(): Promise<CountryLocation[]> {
    const response = await fetch(buildUrl(endpoints.locations));

    if (!response.ok) {
        throw new Error("No fue posible cargar las ubicaciones.");
    }

    return (await response.json()) as CountryLocation[];
}

export async function getUserWithRoles(): Promise<ServerUser[]> {
    const response = await fetch(buildUrl(endpoints.userWithRoles));
    return (await response.json()) as ServerUser[];
}

export async function getUsersById(id: string | number): Promise<ServerUser> {
    const response = await fetch(buildUrl(endpoints.userById(id)));
    return (await response.json()) as ServerUser;
}

export async function createUser(user: Record<string, unknown>): Promise<ServerUser> {
    const response = await fetch(buildUrl(endpoints.users), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });
    return (await response.json()) as ServerUser;
}

export async function updateUser(id: string | number, updates: Record<string, unknown>): Promise<ServerUser> {
    const response = await fetch(buildUrl(endpoints.userById(id)), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
    });
    return (await response.json()) as ServerUser;
}

export async function deleteUser(id: string | number): Promise<void> {
    await fetch(buildUrl(endpoints.userById(id)), {
        method: "DELETE"
    });
}
