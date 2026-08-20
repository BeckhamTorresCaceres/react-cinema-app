import { useEffect, useState } from "react";
import { getMovies, getShowtimes } from "@/features/billboard/services/billboardService";
import { BillboardSection } from "@/features/billboard/components/BillboardSection";
import { HeroSection } from "@/features/Home/components/HeroSection";
import type { Movie, Showtime } from "@/features/billboard/types/billboard.types";

export const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadMovies = async () => {
      try {
        const [movieData, showtimeData] = await Promise.all([getMovies(), getShowtimes()]);
        if (isMounted) {
          setMovies(movieData.filter((movie) => movie.isActive));
          setShowtimes(showtimeData);
        }
      } finally {
        if (isMounted) setIsLoadingMovies(false);
      }
    };

    void loadMovies();
    return () => {
      isMounted = false;
    };
  }, []);

  const upcomingMovies = movies.filter((movie) => {
    const movieShowtimes = showtimes.filter((showtime) => showtime.movieId === movie.id);
    return movieShowtimes.length > 0 && movieShowtimes.every((showtime) => showtime.status === "Próximamente");
  });

  return (
    <main className="min-h-screen bg-[#080616] text-white">
      {isLoadingMovies ? (
        <section className="relative h-[calc(100svh-4rem)] min-h-142.5 overflow-hidden sm:min-h-155 bg-[#080616]">
          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center justify-center px-4">
            <p className="text-lg text-slate-400">Cargando película destacada...</p>
          </div>
        </section>
      ) : (
        <HeroSection allMovies={movies} showtimes={showtimes} />
      )}
      <BillboardSection />
      <section id="proximamente" className="scroll-mt-20 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-white">Próximamente</h2>
          <p className="text-sm text-slate-400">Estrenos que llegarán muy pronto a LumiFilms.</p>
        </div>
        {upcomingMovies.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {upcomingMovies.map((movie) => (
              <article key={movie.id} className="overflow-hidden rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/40">
                <div className="relative aspect-4/5"><img src={movie.poster} alt={movie.title} className="h-full w-full object-cover" /><span className="absolute left-3 top-3 rounded-full bg-[#2F2FE4] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">Próximamente</span></div>
                <div className="p-4"><h3 className="text-xl font-bold text-white">{movie.title}</h3><p className="mt-2 text-xs text-slate-400">{movie.genre} · {movie.duration} min · {movie.rating}</p></div>
              </article>
            ))}
          </div>
        ) : <p className="rounded-2xl border border-dashed border-[#162E93]/50 py-12 text-center text-slate-400">Aún no hay próximos estrenos anunciados.</p>}
      </section>
    </main>
  );
};
