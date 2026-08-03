import { useState } from "react";
import { DateSelector } from "@/features/billboard/components/DataSelector";
import { MovieCard } from "./MovieCard";
import { MOCK_MOVIES } from "../data/billboard.mock";
import { BillboardFilters } from "./BillboardFilters";

export const BillboardSection = () => {
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

  
  // ACTUALIZADO: Filtrado con búsqueda por texto y género
  
  const filteredMovies = MOCK_MOVIES.filter((movie) => {
    if (!movie.isActive) return false;

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

    return true;
  });

  return (
    <section id="cartelera" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
      {filteredMovies.length > 0 ? (
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