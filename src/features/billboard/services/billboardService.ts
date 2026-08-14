import type { Movie, Showtime } from "@/features/billboard/types/billboard.types";
import { API_URL } from "@/services/api";
import { endpoints } from "@/services/endpoints";

/** Obtiene las películas publicadas en el JSON Server. */
export async function getMovies(): Promise<Movie[]> {
  const response = await fetch(`${API_URL}${endpoints.movies}`);

  if (!response.ok) {
    throw new Error("No fue posible cargar la cartelera.");
  }

  return response.json() as Promise<Movie[]>;
}

/** Obtiene las funciones, vinculadas a la película y a la sede donde se proyectan. */
export async function getShowtimes(): Promise<Showtime[]> {
  const response = await fetch(`${API_URL}${endpoints.showtimes}`);

  if (!response.ok) {
    throw new Error("No fue posible cargar las funciones.");
  }

  return response.json() as Promise<Showtime[]>;
}
