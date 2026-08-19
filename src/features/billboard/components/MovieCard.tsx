// Tarjeta individual con formato / horarios

import { Clock, Star } from "lucide-react";
import { useNavigate } from "react-router";
import type { MovieWithShowtimes } from "@/features/billboard/types/billboard.types";

interface MovieCardProps {
  movie: MovieWithShowtimes;
  onBuyTickets?: (movieId: string, showtimeId: string) => void;
}

export const MovieCard = ({ movie, onBuyTickets }: MovieCardProps) => {
  const navigate = useNavigate();
  const openDetails = () => navigate(`/Movie/${movie.id}`);
  const buyTickets = (showtimeId: string) => {
    onBuyTickets?.(movie.id, showtimeId);
    navigate(`/asientos?movieId=${movie.id}&showtimeId=${showtimeId}`);
  };
  const availableFormats = [...new Set(movie.showtimes.map((showtime) => showtime.format))];

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`Ver detalles de ${movie.title}`}
      onClick={openDetails}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDetails();
        }
      }}
      className="group relative flex cursor-pointer overflow-hidden rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/40 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#2F2FE4] hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8E8EFF] sm:flex-col"
    >
      
      {/* Póster e Indicadores */}
      <div className="relative w-[38%] shrink-0 overflow-hidden sm:aspect-4/5 sm:w-full">
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#080616] via-transparent to-transparent opacity-90" />

        {/* Badge de Estreno */}
        {movie.showtimes.some((showtime) => showtime.status === "Estreno") && (
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
      <div className="flex min-w-0 flex-1 flex-col justify-between p-3 sm:p-4">
        <div>
          <h3 className="text-base font-bold leading-tight text-white group-hover:text-[#8E8EFF] sm:text-xl">
            {movie.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-300 sm:gap-2 sm:text-xs">
            <span>•</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {movie.duration} min</span>
            <span>•</span>
            <span>{movie.genre}</span>
          </div>

          <p className="mt-2 text-[11px] text-slate-400 sm:text-xs">
            Dir: <span className="text-slate-200">{movie.director}</span>
          </p>

          {/* Formatos disponibles */}
          <div className="mt-3 flex flex-wrap gap-1">
            {availableFormats.map((fmt) => (
              <span key={fmt} className="rounded border border-[#2F2FE4]/40 bg-[#2F2FE4]/10 px-2 py-0.5 text-[10px] font-bold text-[#8E8EFF]">
                {fmt}
              </span>
            ))}
          </div>

          {/* Horarios de funciones */}
          <div className="mt-3 sm:mt-4">
            <span className="text-[11px] font-semibold uppercase text-slate-400 sm:text-xs">Horarios:</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5 sm:mt-2 sm:gap-2">
              {movie.showtimes.map((st) => (
                <button
                  key={st.id}
                  disabled={st.isSoldOut}
                  onClick={(event) => {
                    event.stopPropagation();
                    buyTickets(st.id);
                  }}
                  className={`rounded-lg px-2 py-1.5 text-[11px] font-medium transition sm:px-2.5 sm:text-xs ${
                    st.isSoldOut
                      ? "cursor-not-allowed bg-slate-800 text-slate-500 line-through opacity-60"
                      : "bg-[#162E93]/60 text-white hover:bg-[#2F2FE4]"
                  }`}
                  title={st.isSoldOut ? "Función Agotada" : `Comprar ${st.format} ${st.language}`}
                >
                  {st.time} <span className="text-[10px] opacity-75">({st.format} · {st.language})</span>
                  {st.isSoldOut && <span className="sr-only"> — Agotada</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </article>
  );
};
