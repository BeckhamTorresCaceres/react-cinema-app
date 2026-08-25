import { endpoints } from "./endpoints";
import { request } from "./http";

export interface CinemaLocation {
  id: string;
  cityId: string;
  nombre: string;
  direccion: string;
}

export interface CityLocation {
  id: string;
  countryId: string;
  nombre: string;
  departamento: string;
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

interface CountryRecord {
  id: string;
  nombre: string;
}

interface CityRecord {
  id: string;
  countryId: string;
  nombre: string;
  departamento: string;
}

interface CinemaRecord extends CinemaLocation {}

export async function getLocations(): Promise<CountryLocation[]> {
  try {
    const [countries, cities, cinemas] = await Promise.all([
      request<CountryRecord[]>(endpoints.countries),
      request<CityRecord[]>(endpoints.cities),
      request<CinemaRecord[]>(endpoints.cinemas),
    ]);

    return countries.map((country) => {
      const countryCities = cities.filter((city) => city.countryId === country.id);
      const departmentNames = [...new Set(countryCities.map((city) => city.departamento))];

      return {
        ...country,
        departamentos: departmentNames.map((department) => ({
          id: `${country.id}-${department.toLocaleLowerCase("es-CO").replaceAll(/[^a-z0-9]+/g, "-")}`,
          nombre: department,
          ciudades: countryCities
            .filter((city) => city.departamento === department)
            .map((city) => ({
              ...city,
              cines: cinemas.filter((cinema) => cinema.cityId === city.id),
            })),
        })),
      };
    });
  } catch {
    throw new Error("No fue posible cargar las ubicaciones.");
  }
}
