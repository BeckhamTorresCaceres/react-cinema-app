// src/admin/pages/AdminMoviesPage.tsx
import { useEffect, useState, useMemo } from "react";
import { Edit3, Trash2, Eye, Search, Filter } from "lucide-react";
import { getMovies, updateMovie, deleteMovie } from "@/services/movies";

export interface Movie {
  id: string;
  title: string;
  poster: string;
  trailer: string;
  genre: string;
  rating: string;
  duration: number;
  director: string;
  score: number;
  isActive: boolean;
}

export const AdminMoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [directorFilter, setDirectorFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Estados de Modales
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoviesList = async () => {
      try {
        const data = await getMovies();
        setMovies(data);
      } catch (err) {
        console.error("Error al obtener películas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesList();
  }, []);

  // Obtener la lista única de géneros a partir de las películas registradas
  const availableGenres = useMemo(() => {
    const genres = movies.map((m) => m.genre).filter(Boolean);
    return Array.from(new Set(genres));
  }, [movies]);

  // Filtrado Dinámico
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesTitle = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDirector = movie.director.toLowerCase().includes(directorFilter.toLowerCase());
      const matchesGenre = genreFilter === "" || movie.genre.toLowerCase() === genreFilter.toLowerCase();
      const matchesRating = ratingFilter === "" || movie.rating === ratingFilter;
      const matchesActive =
        activeFilter === "all"
          ? true
          : activeFilter === "true"
          ? movie.isActive === true
          : movie.isActive === false;

      return matchesTitle && matchesDirector && matchesGenre && matchesRating && matchesActive;
    });
  }, [movies, searchTerm, directorFilter, genreFilter, ratingFilter, activeFilter]);

  // Manejadores de Acciones
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMovie) return;

    try {
      await updateMovie(editingMovie.id, editingMovie);
      setMovies((prev) => prev.map((m) => (m.id === editingMovie.id ? editingMovie : m)));
      setEditingMovie(null);
    } catch (err) {
      console.error("Error al actualizar la película:", err);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMovie(deleteId);
      setMovies((prev) => prev.filter((m) => m.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error("Error al eliminar la película:", err);
    }
  };

  if (loading) return <div className="text-slate-400">Cargando catálogo de películas...</div>;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Gestión de Películas</h1>
          <p className="mt-1 text-sm text-slate-400">Administra el catálogo y detalles de la cartelera</p>
        </div>
      </div>

      {/* SECCIÓN DE FILTROS */}
      <div className="rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/20 p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <Filter size={16} className="text-[#8E8EFF]" />
          <span>Filtros de Búsqueda</span>
        </div>
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5">
          {/* Nombre Película */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[#162E93] bg-[#080616] pl-9 pr-3 py-2 text-xs text-slate-200 outline-none focus:border-[#2F2FE4]"
            />
          </div>

          {/* Director */}
          <input
            type="text"
            placeholder="Filtrar por director..."
            value={directorFilter}
            onChange={(e) => setDirectorFilter(e.target.value)}
            className="w-full rounded-xl border border-[#162E93] bg-[#080616] px-3 py-2 text-xs text-slate-200 outline-none focus:border-[#2F2FE4]"
          />

          {/* Género (Menú Desplegable) */}
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="w-full rounded-xl border border-[#162E93] bg-[#080616] px-3 py-2 text-xs text-slate-200 outline-none focus:border-[#2F2FE4]"
          >
            <option value="">Todos los géneros</option>
            {availableGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>

          {/* Clasificación */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full rounded-xl border border-[#162E93] bg-[#080616] px-3 py-2 text-xs text-slate-200 outline-none focus:border-[#2F2FE4]"
          >
            <option value="">Todas las clasificaciones</option>
            <option value="G">G</option>
            <option value="PG">PG</option>
            <option value="PG-13">PG-13</option>
            <option value="R">R</option>
            <option value="NC-17">NC-17</option>
          </select>

          {/* Estado isActive (Menú Desplegable) */}
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="w-full rounded-xl border border-[#162E93] bg-[#080616] px-3 py-2 text-xs text-slate-200 outline-none focus:border-[#2F2FE4]"
          >
            <option value="all">Todos los estados</option>
            <option value="true">Activa (True)</option>
            <option value="false">Inactiva (False)</option>
          </select>
        </div>
      </div>

      {/* TABLA DE PELÍCULAS */}
      <div className="overflow-hidden rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/20">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-[#162E93]/40 bg-[#080616]/60 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-4">Película</th>
              <th className="px-6 py-4">Género / Clasif.</th>
              <th className="px-6 py-4">Director</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#162E93]/20">
            {filteredMovies.map((movie) => (
              <tr key={movie.id} className="transition hover:bg-[#1A1953]/40">
                <td className="px-6 py-4 font-semibold text-white flex items-center gap-3">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="h-10 w-8 rounded object-cover border border-[#162E93]"
                  />
                  <div>
                    <p className="font-bold text-white">{movie.title}</p>
                    <p className="text-xs text-slate-400">{movie.duration} min</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-md bg-[#162E93]/40 px-2 py-1 text-xs text-slate-300">
                    {movie.genre} • {movie.rating}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-300">{movie.director}</td>
                <td className="px-6 py-4 font-bold text-amber-400">★ {movie.score}</td>
                <td className="px-6 py-4">
                  {movie.isActive ? (
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                      Activa
                    </span>
                  ) : (
                    <span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20">
                      Inactiva
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => setSelectedMovie(movie)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#162E93]/40 transition"
                    title="Ver detalle"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => setEditingMovie({ ...movie })}
                    className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/20 transition"
                    title="Editar"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteId(movie.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMovies.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm">
            No se encontraron películas con los filtros seleccionados.
          </div>
        )}
      </div>

      {/* MODAL EDICIÓN COMPLETA */}
      {editingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-[#162E93] bg-[#080616] p-6 shadow-2xl space-y-4 my-8">
            <h2 className="text-xl font-bold text-white">Editar Película</h2>
            <form onSubmit={handleSaveEdit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Título */}
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400">Título</label>
                <input
                  type="text"
                  value={editingMovie.title}
                  onChange={(e) => setEditingMovie({ ...editingMovie, title: e.target.value })}
                  className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/30 p-2.5 text-sm text-white outline-none focus:border-[#2F2FE4]"
                  required
                />
              </div>

              {/* Director */}
              <div>
                <label className="text-xs text-slate-400">Director</label>
                <input
                  type="text"
                  value={editingMovie.director}
                  onChange={(e) => setEditingMovie({ ...editingMovie, director: e.target.value })}
                  className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/30 p-2.5 text-sm text-white outline-none focus:border-[#2F2FE4]"
                  required
                />
              </div>

              {/* Género */}
              <div>
                <label className="text-xs text-slate-400">Género</label>
                <input
                  type="text"
                  value={editingMovie.genre}
                  onChange={(e) => setEditingMovie({ ...editingMovie, genre: e.target.value })}
                  className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/30 p-2.5 text-sm text-white outline-none focus:border-[#2F2FE4]"
                  required
                />
              </div>

              {/* Clasificación */}
              <div>
                <label className="text-xs text-slate-400">Clasificación (Rating)</label>
                <select
                  value={editingMovie.rating}
                  onChange={(e) => setEditingMovie({ ...editingMovie, rating: e.target.value })}
                  className="w-full rounded-xl border border-[#162E93] bg-[#080616] p-2.5 text-sm text-white outline-none focus:border-[#2F2FE4]"
                >
                  <option value="G">G</option>
                  <option value="PG">PG</option>
                  <option value="PG-13">PG-13</option>
                  <option value="R">R</option>
                  <option value="NC-17">NC-17</option>
                </select>
              </div>

              {/* Duración */}
              <div>
                <label className="text-xs text-slate-400">Duración (minutos)</label>
                <input
                  type="number"
                  value={editingMovie.duration}
                  onChange={(e) => setEditingMovie({ ...editingMovie, duration: Number(e.target.value) })}
                  className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/30 p-2.5 text-sm text-white outline-none focus:border-[#2F2FE4]"
                  required
                />
              </div>

              {/* Score */}
              <div>
                <label className="text-xs text-slate-400">Puntuación (Score)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={editingMovie.score}
                  onChange={(e) => setEditingMovie({ ...editingMovie, score: Number(e.target.value) })}
                  className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/30 p-2.5 text-sm text-white outline-none focus:border-[#2F2FE4]"
                  required
                />
              </div>

              {/* Estado isActive */}
              <div>
                <label className="text-xs text-slate-400">Estado de la Película</label>
                <select
                  value={editingMovie.isActive ? "true" : "false"}
                  onChange={(e) => setEditingMovie({ ...editingMovie, isActive: e.target.value === "true" })}
                  className="w-full rounded-xl border border-[#162E93] bg-[#080616] p-2.5 text-sm text-white outline-none focus:border-[#2F2FE4]"
                >
                  <option value="true">Activa (True)</option>
                  <option value="false">Inactiva (False)</option>
                </select>
              </div>

              {/* URL Poster */}
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400">URL del Poster</label>
                <input
                  type="url"
                  value={editingMovie.poster}
                  onChange={(e) => setEditingMovie({ ...editingMovie, poster: e.target.value })}
                  className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/30 p-2.5 text-sm text-white outline-none focus:border-[#2F2FE4]"
                  required
                />
              </div>

              {/* URL Trailer */}
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400">URL del Trailer (Embed Youtube)</label>
                <input
                  type="url"
                  value={editingMovie.trailer}
                  onChange={(e) => setEditingMovie({ ...editingMovie, trailer: e.target.value })}
                  className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/30 p-2.5 text-sm text-white outline-none focus:border-[#2F2FE4]"
                  required
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMovie(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2F2FE4] px-5 py-2 text-xs font-bold text-white hover:bg-blue-600 transition"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALLE PELÍCULA */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[#162E93] bg-[#080616] p-6 shadow-2xl space-y-4">
            <div className="flex gap-4">
              <img src={selectedMovie.poster} alt={selectedMovie.title} className="h-36 w-24 rounded-xl object-cover border border-[#162E93]" />
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">{selectedMovie.title}</h3>
                <p className="text-xs text-slate-400">Director: {selectedMovie.director}</p>
                <p className="text-xs text-slate-400">Género: {selectedMovie.genre} ({selectedMovie.rating})</p>
                <p className="text-xs text-slate-400">Duración: {selectedMovie.duration} minutos</p>
                <p className="text-xs text-amber-400 font-bold">Puntuación: ★ {selectedMovie.score}</p>
                <p className="text-xs text-slate-400">
                  Estado: {selectedMovie.isActive ? "Activa" : "Inactiva"}
                </p>
              </div>
            </div>

            {selectedMovie.trailer && (
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-[#162E93]">
                <iframe
                  src={selectedMovie.trailer}
                  title="Trailer"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedMovie(null)}
                className="rounded-xl bg-[#162E93]/40 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-[#162E93]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR ELIMINACIÓN */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/40 bg-[#080616] p-6 text-center shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">¿Eliminar Película?</h3>
            <p className="text-xs text-slate-400">Esta acción eliminará el registro de la base de datos.</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};