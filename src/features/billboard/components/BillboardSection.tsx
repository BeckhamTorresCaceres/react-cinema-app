import { useEffect, useState } from "react";
import { DateSelector } from "@/features/billboard/components/DataSelector";
import { MovieCard } from "./MovieCard";
import { BillboardFilters } from "./BillboardFilters";
import { getMovies } from "../services/billboardService";
import type { Movie } from "../types/billboard.types";

export const BillboardSection = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  
  // Estado unificado para la barra de filtros avanzada
  
  const [filters, setFilters] = useState({
    searchTerm: "",
    genre: "all",
    format: "all",
    rating: "all",
    complex: "all",
  });

  
  // Manejador para actualizar los filtros dinámicamente
  
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    let isMounted = true;

    const loadMovies = async () => {
      try {
        const data = await getMovies();
        if (isMounted) setMovies(data);
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

  
  // ACTUALIZADO: Filtrado con búsqueda por texto y género
  
  const filteredMovies = movies.filter((movie) => {
    if (!movie.isActive || !movie.isReleased) return false;

    // Filtro por texto de búsqueda
    if (
      filters.searchTerm &&
      !movie.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filtro por género
    if (filters.genre !== "all" && movie.genre !== filters.genre) {
      return false;
    }

    if (filters.format !== "all" && !movie.formats.includes(filters.format as Movie["formats"][number])) {
      return false;
    }

    if (filters.rating !== "all" && movie.rating !== filters.rating) {
      return false;
    }

    return true;
  });

  return (
    <section id="cartelera" className="scroll-mt-20 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Cartelera Semanal</h2>
          <p className="text-sm text-slate-400">Elige tu función y compra tus entradas</p>
        </div>

        {/* 🟡 ELIMINADO: El <select> individual de género anterior se removió 
            porque ahora está integrado dentro de la barra de filtros. */}
      </div>

      {/* 🟢 AGREGADO: Barra de Filtros Avanzada                         */}
      <BillboardFilters filters={filters} onFilterChange={handleFilterChange} />

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
