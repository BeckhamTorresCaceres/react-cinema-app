import { useMemo } from "react";
import { useMovieCatalog } from "@/features/billboard/hooks/useMovieCatalog";
import { useLocations, useSelectedLocation } from "@/features/locations/hooks";
import { getCinemasForLocation } from "@/features/locations/utils/locationTree";
import { BillboardSection } from "@/features/billboard/components/BillboardSection";
import { HeroSection } from "../components/HeroSection";
import { UpcomingMoviesSection } from "../components/UpcomingMoviesSection";
import { useHomeMovies } from "../hooks/useHomeMovies";

export const HomePage = () => {
  const { movies: catalogMovies, showtimes, isLoading: isLoadingMovies } = useMovieCatalog();
  const { locations } = useLocations();
  const selectedLocation = useSelectedLocation();

  const cinemaIdsForSelectedLocation = useMemo(() => {
    const cinemas = getCinemasForLocation(locations, selectedLocation);
    return new Set(cinemas.map((cinema) => cinema.id));
  }, [locations, selectedLocation]);

  const { moviesByLocation, upcomingMovies } = useHomeMovies({
    catalogMovies,
    showtimes,
    selectedLocation,
    cinemaIdsForSelectedLocation,
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A071E] text-white">
      <HeroSection movies={moviesByLocation} isLoading={isLoadingMovies} />

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <BillboardSection />
      </section>

      <UpcomingMoviesSection movies={upcomingMovies} />
    </div>
  );
};