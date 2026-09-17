import { useMemo } from "react";
import type { Movie } from "@/features/billboard/types/billboard.types";
import type { Showtime } from "@/features/billboard/types/billboard.types";
import type { SelectedLocation } from "@/features/locations/types/location.types";

interface UseHomeMoviesOptions {
  catalogMovies: Movie[];
  showtimes: Showtime[];
  selectedLocation: SelectedLocation;
  cinemaIdsForSelectedLocation: Set<string>;
}

export const useHomeMovies = ({
  catalogMovies,
  showtimes,
  selectedLocation,
  cinemaIdsForSelectedLocation,
}: UseHomeMoviesOptions) => {
  const hasLocationSelection = Boolean(selectedLocation.city && cinemaIdsForSelectedLocation.size > 0);

  const moviesByLocation = useMemo(() => {
    const activeMovies = catalogMovies.filter((movie) => movie.isActive);

    if (!hasLocationSelection) {
      return activeMovies;
    }

    const movieIdsInLocation = new Set(
      showtimes
        .filter(
          (showtime) =>
            cinemaIdsForSelectedLocation.has(showtime.cinemaId) &&
            showtime.status !== "Próximamente"
        )
        .map((showtime) => showtime.movieId)
    );

    return activeMovies.filter((movie) => movieIdsInLocation.has(movie.id));
  }, [catalogMovies, cinemaIdsForSelectedLocation, hasLocationSelection, showtimes]);

  const upcomingMovies = useMemo(() => {
    if (!hasLocationSelection) {
      return catalogMovies.filter((movie) => {
        const movieShowtimes = showtimes.filter((showtime) => showtime.movieId === movie.id);
        return movieShowtimes.length > 0 && movieShowtimes.every((showtime) => showtime.status === "Próximamente");
      });
    }

    return catalogMovies.filter((movie) => {
      const movieShowtimes = showtimes.filter(
        (showtime) =>
          showtime.movieId === movie.id &&
          cinemaIdsForSelectedLocation.has(showtime.cinemaId)
      );

      return (
        movieShowtimes.length > 0 &&
        movieShowtimes.every((showtime) => showtime.status === "Próximamente")
      );
    });
  }, [catalogMovies, cinemaIdsForSelectedLocation, hasLocationSelection, showtimes]);

  return {
    moviesByLocation,
    upcomingMovies,
  };
};
