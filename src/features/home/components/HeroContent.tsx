import { Play } from "lucide-react";
import type { HeroContentProps } from "@/features/home/types/hero.types";

export const HeroContent = ({ movie, onViewShowtimes }: HeroContentProps) => {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-[2px] w-8 bg-amber-400" />
        <span className="text-xs font-semibold tracking-[0.2em] text-amber-400 uppercase">
          Disponible en tu Sede
        </span>
      </div>

      <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
        {movie.title}
      </h1>

      <p className="text-sm text-slate-300 sm:text-base">
        {movie.genre} • {movie.duration} min • {movie.rating}
      </p>

      <p className="max-w-lg text-sm leading-relaxed text-slate-400">
        Dirigida por {movie.director}. Reserva tus entradas para esta función.
      </p>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="button"
          onClick={onViewShowtimes}
          className="flex items-center gap-2 rounded-xl bg-[#2F2FE4] px-6 py-3 font-semibold text-white shadow-lg transition duration-200 hover:bg-[#162E93]"
        >
          <Play className="h-5 w-5 fill-current" /> Ver función
        </button>
      </div>
    </div>
  );
};
