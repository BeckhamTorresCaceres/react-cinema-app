import type { Movie } from "@/features/billboard/types/billboard.types";
import { API_URL } from "@/servers/api";

/** Obtiene las películas publicadas en el JSON Server. */
export async function getMovies(): Promise<Movie[]> {
  const response = await fetch(`${API_URL}/movies`);

  if (!response.ok) {
    throw new Error("No fue posible cargar la cartelera.");
  }

  return response.json() as Promise<Movie[]>;
}
