import { Trash2, Edit3, Star, Eye } from "lucide-react";
import type { MovieRecord } from "@/features/billboard/types/billboard.types";

interface MoviesTableProps {
  movies: MovieRecord[];
  onView: (movie: MovieRecord) => void;
  onEdit: (movie: MovieRecord) => void;
  onDelete: (movieId: string) => void;
}

export const MoviesTable = ({ movies, onView, onEdit, onDelete }: MoviesTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/20">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="border-b border-[#162E93]/40 bg-[#080616]/60 text-xs uppercase text-slate-400">
          <tr>
            <th className="px-6 py-4">Película</th>
            <th className="px-6 py-4">Director</th>
            <th className="px-6 py-4">Género</th>
            <th className="px-6 py-4">Calificación</th>
            <th className="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#162E93]/20">
          {movies.map((movie) => (
            <tr key={movie.id} className="transition hover:bg-[#1A1953]/40">
              <td
                onClick={() => onView(movie)}
                className="px-6 py-4 font-semibold text-white cursor-pointer hover:text-[#8E8EFF] flex items-center gap-3"
              >
                <img src={movie.poster} alt={movie.title} className="h-10 w-8 rounded object-cover" />
                <span>{movie.title}</span>
              </td>
              <td className="px-6 py-4">{movie.director}</td>
              <td className="px-6 py-4">{movie.genre}</td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-1 font-bold text-amber-400">
                  <Star size={14} fill="currentColor" /> {movie.score}
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-1">
                <button
                  onClick={() => onView(movie)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-[#162E93]/40 hover:text-white"
                  title="Ver detalle"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => onEdit(movie)}
                  className="rounded-lg p-2 text-blue-400 hover:bg-blue-500/10"
                  title="Editar"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => onDelete(movie.id)}
                  className="rounded-lg p-2 text-rose-400 hover:bg-rose-500/10"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
