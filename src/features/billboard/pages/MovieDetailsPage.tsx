import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Play, Star } from "lucide-react";
import { Link, useParams } from "react-router";
import { getMovies, getShowtimes } from "../services/billboardService";
import type { Movie, Showtime } from "../types/billboard.types";

const getYouTubeVideoId = (url: string | undefined): string | null => {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
};

export const MovieDetailsPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getMovies(), getShowtimes()])
      .then(([movies, showtimes]) => {
        if (isMounted) {
          setMovie(movies.find((item) => item.id === movieId) ?? null);
          setShowtimes(showtimes.filter((showtime) => showtime.movieId === movieId));
        }
      })
      .catch((error) => {
        console.error("Error al cargar la película:", error);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [movieId]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#080616] px-6 py-20 text-center text-slate-300">
        Cargando película...
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="min-h-screen bg-[#080616] px-6 py-20 text-center text-white">
        <h1 className="text-3xl font-bold">Película no encontrada</h1>
        <Link to="/#cartelera" className="mt-6 inline-block text-[#8E8EFF] hover:underline">
          Volver a cartelera
        </Link>
      </main>
    );
  }

  const trailerId = getYouTubeVideoId(movie.trailer);
  const trailerUrl = trailerId
    ? `https://www.youtube.com/embed/${trailerId}?autoplay=1`
    : null;
  const youtubeUrl = trailerId
    ? `https://www.youtube.com/watch?v=${trailerId}`
    : movie.trailer;

  const hours = Math.floor(movie.duration / 60);
  const minutes = movie.duration % 60;
  const availableLanguages = [...new Set(showtimes.map((showtime) => showtime.language))];
  const availableFormats = [...new Set(showtimes.map((showtime) => showtime.format))];

  return (
    <main className="min-h-screen bg-[#080616] pb-20 text-white">
<div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
  <Link
    to="/#cartelera"
    className="group inline-flex items-center gap-2 rounded-full border border-[#162E93]/40 bg-[#1A1953]/30 px-4 py-2 text-xs sm:text-sm font-medium text-slate-300 backdrop-blur-md shadow-md transition-all duration-200 hover:border-[#2F2FE4] hover:bg-[#2F2FE4]/30 hover:text-white hover:shadow-[#2F2FE4]/20 active:scale-95"
  >
    <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
    <span>Volver a cartelera</span>
  </Link>
</div>

      {/* Hero Banner e Imagen Flotante Alineada a la Izquierda */}
      <div className="relative mt-6 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Contenedor del Banner Principal */}
          <div className="relative h-[340px] sm:h-[420px] w-full overflow-hidden rounded-3xl border border-[#162E93]/30 shadow-2xl">
            {/* Fondo con poster difuminado */}
            <div 
              className="absolute inset-0 bg-cover bg-center filter brightness-90 blur-sm scale-105"
              style={{ backgroundImage: `url(${movie.poster})` }}
            />
            
            {/* Gradiente oscuro superior e inferior */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080616] via-[#080616]/60 to-black/30" />

            {/* Botón Central de Tráiler */}
            <div className="absolute inset-0 flex items-center justify-center">
              {trailerUrl ? (
                <button
                  onClick={() => setShowTrailerModal(true)}
                  className="group flex h-20 w-20 items-center justify-center rounded-full bg-red-600/90 shadow-2xl shadow-red-600/50 transition-all duration-300 hover:scale-110 hover:bg-red-600 active:scale-95"
                  title="Ver tráiler"
                >
                  <Play size={32} className="fill-white text-white ml-1 transition-transform group-hover:scale-105" />
                </button>
              ) : (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-20 w-20 items-center justify-center rounded-full bg-red-600/90 shadow-2xl shadow-red-600/50 transition-all duration-300 hover:scale-110 hover:bg-red-600"
                >
                  <Play size={32} className="fill-white text-white ml-1" />
                </a>
              )}
            </div>

            {/* Título y badge desplazados a la derecha de la carátula */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 pl-[220px] sm:pl-[270px] md:pl-[300px] transition-all">
              <div className="max-w-2xl">
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-white drop-shadow-md">
                  {movie.title}
                </h1>
                
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur-md">
                    {movie.rating}
                  </span>
                  {showtimes.some((showtime) => showtime.status === "Estreno") && (
                    <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-md">
                      Estreno
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Carátula flotante exactamente a la izquierda sobrepuesta (Estilo Cine Colombia) */}
          <div className="relative z-20 -mt-36 sm:-mt-48 ml-8 sm:ml-12 w-fit">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-36 sm:w-48 md:w-56 aspect-[2/3] rounded-2xl object-cover shadow-2xl border-4 border-[#080616] ring-1 ring-white/10"
            />
          
          </div>

        </div>
      </div>

      {/* Grid de Información Inferior */}
      <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          
          {/* Detalles Principales */}
          <div className="space-y-6 md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-3xl border border-[#162E93]/40 bg-[#1A1953]/30 p-6 sm:p-8 backdrop-blur-md">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Director</h3>
                <p className="mt-2 text-lg font-semibold text-white">{movie.director}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Puntuación</h3>
                <p className="mt-2 flex items-center gap-1.5 text-lg font-bold text-amber-400">
                  <Star size={20} className="fill-amber-400" /> {movie.score} <span className="text-xs text-slate-400 font-normal">/ 10</span>
                </p>
              </div>

              <div className="sm:col-span-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Idiomas</h3>
                <div className="flex flex-wrap gap-2">
                  {availableLanguages.map((lang) => (
                    <span key={lang} className="rounded-xl bg-[#080616]/60 border border-[#2F2FE4]/30 px-3.5 py-1.5 text-sm text-slate-200">
                      {lang}
                    </span>
                  ))}
                  {availableLanguages.length === 0 && <span className="text-sm text-slate-400">Sin funciones disponibles</span>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Formatos Disponibles</h3>
                <div className="flex flex-wrap gap-2">
                  {availableFormats.map((format) => (
                    <span key={format} className="rounded-xl bg-[#2F2FE4]/20 border border-[#2F2FE4]/50 px-3.5 py-1.5 text-sm font-bold text-[#8E8EFF]">
                      {format}
                    </span>
                  ))}
                  {availableFormats.length === 0 && <span className="text-sm text-slate-400">Sin funciones disponibles</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Columna Lateral */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-[#162E93]/40 bg-[#1A1953]/30 p-6 sm:p-8 backdrop-blur-md space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Duración</h3>
                <p className="mt-1.5 text-base font-semibold text-white flex items-center gap-2">
                  <Clock size={18} className="text-[#8E8EFF]" /> {hours > 0 ? `${hours}h ` : ''}{minutes} min
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Género</h3>
                <p className="mt-1.5 text-base font-semibold text-white">{movie.genre}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal para el reproductor de Tráiler */}
      {showTrailerModal && trailerUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setShowTrailerModal(false)}
        >
          <div 
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-[#162E93]/50 bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video w-full bg-black">
              <iframe
                src={trailerUrl}
                title={`Tráiler de ${movie.title}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
