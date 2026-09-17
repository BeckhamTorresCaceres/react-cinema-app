import React from "react";
import type { Movie } from "@/features/billboard/types/billboard.types";

interface UpcomingMoviesSectionProps {
  movies: Movie[];
}

export const UpcomingMoviesSection: React.FC<UpcomingMoviesSectionProps> = ({ movies }) => {
  return (
    <section className="relative z-10 px-6 py-12 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Próximamente</h2>
        <p className="text-slate-400 text-sm">Estrenos que llegarán muy pronto a LumiFilms.</p>
      </div>

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group relative rounded-xl overflow-hidden bg-[#1A1953]/50 border border-[#162E93] transition hover:border-[#2F2FE4]"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="p-3">
                <span className="text-xs text-amber-400 font-semibold">Próximamente</span>
                <h3 className="font-bold text-sm truncate text-white">{movie.title}</h3>
                <p className="text-xs text-slate-400">
                  {movie.genre} · {movie.duration} min · {movie.rating}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 text-sm">Aún no hay próximos estrenos anunciados.</p>
      )}
    </section>
  );
};