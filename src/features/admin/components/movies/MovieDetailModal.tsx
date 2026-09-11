import { Star, X } from "lucide-react";
import type { MovieRecord } from "@/features/billboard/types/billboard.types";

interface MovieDetailModalProps {
  movie: MovieRecord;
  onClose: () => void;
}

export const MovieDetailModal = ({ movie, onClose }: MovieDetailModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#162E93] bg-[#080616] p-6 shadow-2xl text-white">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>
        <div className="flex gap-4">
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-48 w-32 rounded-xl object-cover border border-[#162E93]"
          />
          <div className="space-y-2 text-xs">
            <h2 className="text-xl font-bold text-white">{movie.title}</h2>
            <p><span className="text-slate-400">Director:</span> {movie.director}</p>
            <p><span className="text-slate-400">Género:</span> {movie.genre}</p>
            <p><span className="text-slate-400">Duración:</span> {movie.duration} min</p>
            <p><span className="text-slate-400">Clasificación:</span> {movie.rating}</p>
            <div className="flex items-center gap-1 font-bold text-amber-400 pt-2 text-sm">
              <Star size={16} fill="currentColor" /> {movie.score} / 10
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
