import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { createMovie, deleteMovie, getMovies, updateMovie } from "@/features/billboard/services/movieService";
import { getShowtimes } from "@/features/billboard/services/showtimeService";
import type { MovieRecord } from "@/features/billboard/types/billboard.types";
import type { MovieFormValues } from "../types/admin.types";
import { MoviesTable } from "../components/movies/MoviesTable";
import { MovieDetailModal } from "../components/movies/MovieDetailModal";
import { DeleteMovieModal } from "../components/movies/DeleteMovieModal";
import { MovieFormModal } from "../components/movies/MovieFormModal";

const emptyFormData: MovieFormValues = {
  title: "",
  poster: "https://picsum.photos/seed/movie/400/600",
  trailer: "",
  genre: "Drama",
  rating: "PG-13",
  duration: 120,
  director: "",
  score: 8.0,
};

export const AdminMoviesPage = () => {
  const [movies, setMovies] = useState<MovieRecord[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieRecord | null>(null); // Modal Ver Detalle
  const [editingMovie, setEditingMovie] = useState<MovieRecord | null>(null); // Modal Editar/Crear
  const [deletingId, setDeletingId] = useState<string | null>(null); // Modal Confirmar Eliminar

  const [formData, setFormData] = useState<MovieFormValues>(emptyFormData);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getMovies()
      .then(setMovies)
      .catch((error: unknown) => console.error(error));
  }, []);

  const fetchMovies = async () => {
    try {
      setMovies(await getMovies());
    } catch (error) {
      console.error(error);
    }
  };

  // Abrir Modal de Edición cargando datos actuales
  const handleOpenEdit = (movie: MovieRecord) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      poster: movie.poster,
      trailer: movie.trailer ?? "",
      genre: movie.genre,
      rating: movie.rating,
      duration: movie.duration,
      director: movie.director,
      score: movie.score,
    });
  };

  const handleOpenCreate = () => {
    setEditingMovie({} as MovieRecord);
    setFormData({ ...emptyFormData, genre: "Acción" });
  };

  // Crear o Editar Película
  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const isEdit = Boolean(editingMovie?.id);

    const payload = isEdit
      ? { ...editingMovie, ...formData }
      : {
          ...formData,
          isActive: true,
        };

    try {
      if (isEdit && editingMovie?.id) {
        await updateMovie(editingMovie.id, payload);
      } else {
        await createMovie(payload);
      }
      await fetchMovies();
      setEditingMovie(null);
    } catch (error) {
      console.error("Error al guardar película:", error);
      setErrorMessage(error instanceof Error ? error.message : "No fue posible guardar la película.");
    }
  };

  // Confirmar y Eliminar
  const confirmDelete = async () => {
    if (!deletingId) return;
    setErrorMessage(null);
    try {
      const showtimes = await getShowtimes();
      const activeDependencies = showtimes.filter(
        (showtime) => String(showtime.movieId) === String(deletingId) && !showtime.isSoldOut && showtime.status !== "Finalizada"
      );
      if (activeDependencies.length > 0) {
        setErrorMessage("No puedes eliminar esta película porque tiene funciones activas asociadas.");
        setDeletingId(null);
        return;
      }
      await deleteMovie(deletingId);
      setMovies((current) => current.filter((m) => m.id !== deletingId));
      setDeletingId(null);
    } catch (error) {
      console.error("Error al eliminar película:", error);
      setErrorMessage(error instanceof Error ? error.message : "No fue posible eliminar la película.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Catálogo de Películas</h1>
          <p className="mt-1 text-sm text-slate-400">Administra las películas registradas</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-xl bg-[#2F2FE4] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2F2FE4]/30 transition hover:bg-[#162E93]"
        >
          <Plus size={18} /> Nueva Película
        </button>
      </div>

      {errorMessage && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">{errorMessage}</div>}

      <MoviesTable
        movies={movies}
        onView={setSelectedMovie}
        onEdit={handleOpenEdit}
        onDelete={setDeletingId}
      />

      {selectedMovie && (
        <MovieDetailModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      {deletingId && (
        <DeleteMovieModal onCancel={() => setDeletingId(null)} onConfirm={confirmDelete} />
      )}

      {editingMovie && (
        <MovieFormModal
          isEdit={Boolean(editingMovie.id)}
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSaveMovie}
          onCancel={() => setEditingMovie(null)}
        />
      )}
    </div>
  );
};
