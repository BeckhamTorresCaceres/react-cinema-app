import type { MovieRecord } from "@/features/billboard/types/billboard.types";
import { endpoints } from "@/services/endpoints";
import { request } from "@/services/http";

export async function getMovies(): Promise<MovieRecord[]> {
  try {
    return await request<MovieRecord[]>(endpoints.movies);
  } catch {
    throw new Error("No fue posible cargar la cartelera.");
  }
}

export async function getMovieById(movieId: string): Promise<MovieRecord> {
  try {
    return await request<MovieRecord>(endpoints.movieById(movieId));
  } catch {
    throw new Error("No fue posible cargar la película.");
  }
}

export async function createMovie(movie: Record<string, unknown>): Promise<MovieRecord> {
  return request<MovieRecord>(endpoints.movies, {
    method: "POST",
    data: movie,
  });
}

export async function updateMovie(id: string | number, movie: Record<string, unknown>): Promise<MovieRecord> {
  return request<MovieRecord>(endpoints.movieById(id), {
    method: "PUT",
    data: movie,
  });
}

export async function deleteMovie(id: string | number): Promise<void> {
  await request<void>(endpoints.movieById(id), {
    method: "DELETE",
  });
}
