import { useState } from "react";
import { DateSelector } from "./DateSelector";
import { MovieCard } from "./MovieCard";
import { MOCK_MOVIES } from "../data/billboard.mock";

export const BillboardSection = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedGenre, setSelectedGenre] = useState("all");

  const filteredMovies = MOCK_MOVIES.filter((m) => {
    if (!m.isActive) return false;
    if (selectedGenre !== "all" && m.genre !== selectedGenre) return false;
    return true;
  });

  return (
    <section id="cartelera" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Cartelera Semanal</h2>
          <p className="text-sm text-slate-400">Elige tu función y compra tus entradas</p>
        </div>

        {/* Filtro rápido por género */}
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="rounded-lg border border-[#162E93] bg-[#080616] px-4 py-2 text-sm text-white outline-none focus:border-[#2F2FE4]"
        >
          <option value="all">Todos los géneros</option>
          <option value="Acción">Acción</option>
          <option value="Ciencia Ficción">Ciencia Ficción</option>
        </select>
      </div>

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