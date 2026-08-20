import { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, Film, Star, Eye, AlertTriangle, X } from "lucide-react";

interface Movie {
  id: string;
  title: string;
  poster: string;
  genre: string;
  rating: string;
  duration: number;
  director: string;
  languages: string[];
  formats: string[];
  score: number;
  isReleased: boolean;
  isActive: boolean;
}

export const AdminMoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); // Modal Ver Detalle
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null); // Modal Editar/Crear
  const [deletingId, setDeletingId] = useState<string | null>(null); // Modal Confirmar Eliminar

  const [formData, setFormData] = useState({
    title: "",
    poster: "https://picsum.photos/seed/movie/400/600",
    genre: "Drama",
    rating: "PG-13",
    duration: 120,
    director: "",
    score: 8.0,
  });

  const fetchMovies = async () => {
    try {
      const res = await fetch("http://localhost:3001/movies");
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Abrir Modal de Edición cargando datos actuales
  const handleOpenEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      poster: movie.poster,
      genre: movie.genre,
      rating: movie.rating,
      duration: movie.duration,
      director: movie.director,
      score: movie.score,
    });
  };

  // Crear o Editar Película
  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingMovie;
    const url = isEdit ? `http://localhost:3001/movies/${editingMovie.id}` : "http://localhost:3001/movies";
    const method = isEdit ? "PUT" : "POST";

    const payload = isEdit
      ? { ...editingMovie, ...formData }
      : {
          ...formData,
          languages: ["Español", "Inglés"],
          formats: ["2D"],
          isReleased: true,
          isActive: true,
        };

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    fetchMovies();
    setEditingMovie(null);
  };

  // Confirmar y Eliminar
  const confirmDelete = async () => {
    if (!deletingId) return;
    await fetch(`http://localhost:3001/movies/${deletingId}`, { method: "DELETE" });
    setMovies(movies.filter((m) => m.id !== deletingId));
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Catálogo de Películas</h1>
          <p className="mt-1 text-sm text-slate-400">Administra las películas registradas</p>
        </div>
        <button
          onClick={() => {
            setEditingMovie({} as Movie);
            setFormData({
              title: "",
              poster: "https://picsum.photos/seed/movie/400/600",
              genre: "Acción",
              rating: "PG-13",
              duration: 120,
              director: "",
              score: 8.0,
            });
          }}
          className="flex items-center gap-2 rounded-xl bg-[#2F2FE4] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2F2FE4]/30 transition hover:bg-[#162E93]"
        >
          <Plus size={18} /> Nueva Película
        </button>
      </div>

      {/* TABLA DE PELÍCULAS */}
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
                  onClick={() => setSelectedMovie(movie)}
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
                    onClick={() => setSelectedMovie(movie)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-[#162E93]/40 hover:text-white"
                    title="Ver detalle"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(movie)}
                    className="rounded-lg p-2 text-blue-400 hover:bg-blue-500/10"
                    title="Editar"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => setDeletingId(movie.id)}
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

      {/* 1. MODAL DETALLE DE PELÍCULA */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#162E93] bg-[#080616] p-6 shadow-2xl text-white">
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="flex gap-4">
              <img
                src={selectedMovie.poster}
                alt={selectedMovie.title}
                className="h-48 w-32 rounded-xl object-cover border border-[#162E93]"
              />
              <div className="space-y-2 text-xs">
                <h2 className="text-xl font-bold text-white">{selectedMovie.title}</h2>
                <p><span className="text-slate-400">Director:</span> {selectedMovie.director}</p>
                <p><span className="text-slate-400">Género:</span> {selectedMovie.genre}</p>
                <p><span className="text-slate-400">Duración:</span> {selectedMovie.duration} min</p>
                <p><span className="text-slate-400">Clasificación:</span> {selectedMovie.rating}</p>
                <p><span className="text-slate-400">Idiomas:</span> {selectedMovie.languages?.join(", ")}</p>
                <p><span className="text-slate-400">Formatos:</span> {selectedMovie.formats?.join(", ")}</p>
                <div className="flex items-center gap-1 font-bold text-amber-400 pt-2 text-sm">
                  <Star size={16} fill="currentColor" /> {selectedMovie.score} / 10
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL CONFIRMAR ELIMINACIÓN */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-[#080616] p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-500">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">¿Confirmas la eliminación?</h3>
            <p className="mt-2 text-xs text-slate-400">Esta acción removerá la película del sistema permanentemente.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODAL CREAR / EDITAR */}
      {editingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#162E93] bg-[#080616] p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingMovie.id ? "Editar Película" : "Nueva Película"}
            </h2>
            <form onSubmit={handleSaveMovie} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Título</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Director</label>
                <input
                  required
                  type="text"
                  value={formData.director}
                  onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                  className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Género</label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Puntaje</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingMovie(null)}
                  className="rounded-xl px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button type="submit" className="rounded-xl bg-[#2F2FE4] px-4 py-2 text-xs font-semibold text-white">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};