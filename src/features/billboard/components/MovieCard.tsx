// Tarjeta individual con formato / horarios

import { Play, Ticket, Clock, Star } from "lucide-react";
import type { Movie } from "@/features/billboard/types/billboard.types";

interface MovieCardProps {
  movie: Movie;
  onViewDetails?: (id: string) => void;
  onBuyTickets?: (movieId: string, showtimeId: string) => void;
}

export const MovieCard = ({ movie, onViewDetails, onBuyTickets }: MovieCardProps) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/40 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#2F2FE4] hover:shadow-2xl">
      
      {/* Póster e Indicadores */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080616] via-transparent to-transparent opacity-90" />

        {/* Badge de Estreno */}
        {movie.isRelease && (
          <span className="absolute top-3 left-3 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
            Estreno
          </span>
        )}

        {/* Calificación */}
        <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-[#080616]/80 px-2.5 py-1 text-xs font-semibold text-amber-400 backdrop-blur">
          <Star size={12} className="fill-amber-400" />
          {movie.score}
        </span>
      </div>

      {/* Información principal */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-[#8E8EFF]">
            {movie.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="rounded bg-[#162E93]/60 px-2 py-0.5 font-medium">{movie.rating}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {movie.duration} min</span>
            <span>•</span>
            <span>{movie.genre}</span>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Dir: <span className="text-slate-200">{movie.director}</span>
          </p>

          {/* Formatos disponibles */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {movie.formats.map((fmt) => (
              <span key={fmt} className="rounded border border-[#2F2FE4]/40 bg-[#2F2FE4]/10 px-2 py-0.5 text-[10px] font-bold text-[#8E8EFF]">
                {fmt}
              </span>
            ))}
          </div>

          {/* Horarios de funciones */}
          <div className="mt-4">
            <span className="text-xs font-semibold uppercase text-slate-400">Horarios:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {movie.showtimes.map((st) => (
                <button
                  key={st.id}
                  disabled={st.isSoldOut}
                  onClick={() => onBuyTickets?.(movie.id, st.id)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                    st.isSoldOut
                      ? "cursor-not-allowed bg-slate-800 text-slate-500 line-through opacity-60"
                      : "bg-[#162E93]/60 text-white hover:bg-[#2F2FE4]"
                  }`}
                  title={st.isSoldOut ? "Función Agotada" : `Comprar ${st.format} ${st.language}`}
                >
                  {st.time} <span className="text-[10px] opacity-75">({st.format})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-6 flex gap-2 pt-2 border-t border-[#162E93]/30">
          <button
            onClick={() => onViewDetails?.(movie.id)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-[#162E93] bg-[#1A1953]/50 py-2.5 text-xs font-semibold text-white transition hover:bg-[#162E93]"
          >
            <Play size={14} /> Ver detalle
          </button>
          <button
            onClick={() => onBuyTickets?.(movie.id, movie.showtimes[0]?.id || "")}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#2F2FE4] py-2.5 text-xs font-semibold text-white shadow-lg transition hover:bg-[#162E93]"
          >
            <Ticket size={14} /> Comprar
          </button>
        </div>
      </div>
    </div>
  );
};