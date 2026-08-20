import { useEffect, useMemo, useState } from "react";
import { ALL_DATES, DateSelector } from "@/features/billboard/components/DataSelector";
import { MovieCard } from "./MovieCard";
import { BillboardFilters } from "./BillboardFilters";
import { getMovies, getShowtimes } from "../services/billboardService";
import type { Movie, MovieWithShowtimes, Showtime } from "../types/billboard.types";
import { getLocations, type CinemaLocation, type CountryLocation } from "@/services/api";
import { getSavedLocation, type SelectedLocation } from "@/utils/location";

export const BillboardSection = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<CountryLocation[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>(getSavedLocation);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  
  // Estado unificado para la barra de filtros avanzada
  
  const [filters, setFilters] = useState({
    searchTerm: "",
    genre: "all",
    format: "all",
    rating: "all",
    language: "all",
    complex: "all",
  });

  
  // Manejador para actualizar los filtros dinámicamente
  
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    let isMounted = true;

    getLocations()
      .then((data) => {
        if (isMounted) setLocations(data);
      })
      .finally(() => {
        if (isMounted) setIsLoadingLocations(false);
      });

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const updateSelectedLocation = () => setSelectedLocation(getSavedLocation());
    window.addEventListener("lumi-location-changed", updateSelectedLocation);
    return () => window.removeEventListener("lumi-location-changed", updateSelectedLocation);
  }, []);

  const complexes = useMemo<CinemaLocation[]>(() => {
    const country = locations.find((item) => item.nombre === selectedLocation.country);
    const department = country?.departamentos.find((item) => item.nombre === selectedLocation.department);
    return department?.ciudades.find((item) => item.nombre === selectedLocation.city)?.cines ?? [];
  }, [locations, selectedLocation]);

  useEffect(() => {
    setFilters((previous) => (
      previous.complex === "all" || complexes.some((complex) => complex.id === previous.complex)
        ? previous
        : { ...previous, complex: "all" }
    ));
  }, [complexes]);

  useEffect(() => {
    let isMounted = true;

    const loadMovies = async () => {
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

    void loadMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  
  const genres = useMemo(() => [...new Set(movies.map((movie) => movie.genre))].sort(), [movies]);
  const ratings = useMemo(() => [...new Set(movies.map((movie) => movie.rating))].sort(), [movies]);
  const formats = useMemo(() => [...new Set(showtimes.map((showtime) => showtime.format))].sort(), [showtimes]);
  const languages = useMemo(() => [...new Set(showtimes.map((showtime) => showtime.language))].sort(), [showtimes]);
  const cityCinemaIds = useMemo(() => new Set(complexes.map((complex) => complex.id)), [complexes]);

  const filteredMovies = movies.reduce<MovieWithShowtimes[]>((result, movie) => {
    if (!movie.isActive) return result;

    // Filtro por texto de búsqueda
    if (
      filters.searchTerm &&
      !movie.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
    ) {
      return result;
    }

    // Filtro por género
    if (filters.genre !== "all" && movie.genre !== filters.genre) {
      return result;
    }

    if (filters.rating !== "all" && movie.rating !== filters.rating) {
      return result;
    }
    

    const movieShowtimes = showtimes.filter((showtime) => (
      showtime.movieId === movie.id
      && showtime.status === "Estreno"
      && (selectedDate === ALL_DATES || showtime.date === selectedDate)
      && cityCinemaIds.has(showtime.cinemaId)
      && (filters.complex === "all" || showtime.cinemaId === filters.complex)
      && (filters.format === "all" || showtime.format === filters.format)
      && (filters.language === "all" || showtime.language === filters.language)
    ));

    if (movieShowtimes.length > 0) result.push({ ...movie, showtimes: movieShowtimes });
    return result;
  }, []);

  return (
    <section id="cartelera" className="scroll-mt-20 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white">
            Cartelera Semanal{selectedLocation.city && <span className="text-[#8E8EFF]"> {selectedLocation.city}</span>}
          </h2>
          <p className="text-sm text-slate-400">Elige tu función y compra tus entradas</p>
        </div>

        {/* 🟡 ELIMINADO: El <select> individual de género anterior se removió 
            porque ahora está integrado dentro de la barra de filtros. */}
      </div>

      {/* 🟢 AGREGADO: Barra de Filtros Avanzada                         */}
      <BillboardFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        complexes={complexes}
        isLoadingComplexes={isLoadingLocations}
        genres={genres}
        formats={formats}
        ratings={ratings}
        languages={languages}
      />

      {/* Selector de 7 Días */}
      <DateSelector selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      {/* Grid de Películas */}
      {isLoading ? (
        <div className="mt-12 py-12 text-center text-slate-400">
          Cargando cartelera...
        </div>
      ) : error ? (
        <div className="mt-12 rounded-2xl border border-red-500/40 py-12 text-center text-red-300">
          {error}
        </div>
      ) : filteredMovies.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center py-12 border border-dashed border-[#162E93]/50 rounded-2xl">
          <p className="text-slate-400">No hay funciones disponibles para los filtros seleccionados.</p>
        </div>
      )}
    </section>
  );
};
