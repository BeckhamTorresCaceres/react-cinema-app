import type { CountryLocation, CountryRecord, CityRecord, CinemaRecord } from "../types/location.types";
import { endpoints } from "@/services/endpoints";
import { request } from "@/services/http";
export type { CountryLocation } from "../types/location.types";

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
