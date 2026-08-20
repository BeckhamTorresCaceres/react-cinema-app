import { endpoints } from "./endpoints";
import { request } from "./http";

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

export async function getLocations(): Promise<CountryLocation[]> {
  try {
    return await request<CountryLocation[]>(endpoints.locations);
  } catch {
    throw new Error("No fue posible cargar las ubicaciones.");
  }
}
