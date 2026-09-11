import { useEffect, useState } from "react";
import { getMovies, getShowtimes } from "../services/billboardService";
import type { Movie, Showtime } from "../types/billboard.types";

interface MovieCatalog {
  movies: Movie[];
  showtimes: Showtime[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Carga el catálogo completo de películas y funciones. Centraliza el
 * patrón que antes se repetía en BillboardSection, MovieDetailsPage y
 * HomePage (fetch + guard de desmontaje + loading/error).
 */
export const useMovieCatalog = (): MovieCatalog => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCatalog = async () => {
      try {
        const [movieData, showtimeData] = await Promise.all([getMovies(), getShowtimes()]);
        if (isMounted) {
          setMovies(movieData);
          setShowtimes(showtimeData);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No fue posible cargar la cartelera."
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  return { movies, showtimes, isLoading, error };
};
