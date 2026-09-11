import type { CinemaLocation, CountryLocation, SelectedLocation } from "../types/location.types";

/**
 * Recorre el árbol de ubicaciones (país → departamento → ciudad) y devuelve
 * los cines de la ciudad indicada por `selectedLocation`. Si algún nivel no
 * coincide (o falta), devuelve un arreglo vacío.
 */
export const getCinemasForLocation = (
  locations: CountryLocation[],
  selectedLocation: SelectedLocation
): CinemaLocation[] => {
  const country = locations.find((item) => item.nombre === selectedLocation.country);
  const department = country?.departamentos.find((item) => item.nombre === selectedLocation.department);
  return department?.ciudades.find((item) => item.nombre === selectedLocation.city)?.cines ?? [];
};

/**
 * Recorre todo el árbol de ubicaciones buscando un cine puntual por su id,
 * sin importar en qué país/departamento/ciudad esté.
 */
export const findCinema = (
  locations: CountryLocation[],
  cinemaId: string
): CinemaLocation | undefined => {
  for (const country of locations) {
    for (const department of country.departamentos) {
      for (const city of department.ciudades) {
        const cinema = city.cines.find((item) => item.id === cinemaId);
        if (cinema) return cinema;
      }
    }
  }
  return undefined;
};
