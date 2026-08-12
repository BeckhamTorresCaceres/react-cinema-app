import { useCallback, useEffect, useState } from "react";
import { Play, Plus, Heart } from "lucide-react";
import { getMovies } from "@/features/billboard/services/billboardService";
import { BillboardSection } from "@/features/billboard/components/BillboardSection";
import type { Movie } from "@/features/billboard/types/billboard.types";

export const HomePage = () => {
  const [currentMovie, setCurrentMovie] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadMovies = async () => {
      try {
        const data = await getMovies();
        if (isMounted) setMovies(data.filter((movie) => movie.isActive));
      } finally {
        if (isMounted) setIsLoadingMovies(false);
      }
    };

    void loadMovies();
    return () => {
      isMounted = false;
    };
  }, []);

  const nextMovie = useCallback(() => {
    setCurrentMovie((previous) =>
      movies.length ? (previous + 1) % movies.length : 0
    );
  }, [movies.length]);

  const previousMovie = useCallback(() => {
    setCurrentMovie((previous) =>
      movies.length ? (previous - 1 + movies.length) % movies.length : 0
    );
  }, [movies.length]);

  useEffect(() => {
    let blocked = false;
    const handleWheel = (event: WheelEvent) => {
      if (blocked || !movies.length) return;
      blocked = true;
      if (event.deltaY > 0) {
        nextMovie();
      } else {
        previousMovie();
      }
      setTimeout(() => {
        blocked = false;
      }, 300);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [movies.length, nextMovie, previousMovie]);

  const heroMovie = movies[currentMovie];
  const upcomingMovies = movies.filter((movie) => movie.isActive && !movie.isReleased);

  return ( 
    <main className="min-h-screen bg-[#080616] text-white">
      <section id="ubicacion" className="relative h-[calc(100svh-4rem)] min-h-142.5 overflow-hidden sm:min-h-155">
        {heroMovie && (
          <img key={heroMovie.id} src={heroMovie.poster} alt={heroMovie.title} className="absolute inset-0 h-full w-full object-cover transition-all duration-700" />
        )}
        <div className="absolute inset-0 bg-[#080616]/45" />
        <div className="absolute inset-0 bg-linear-to-r from-[#080616] via-[#080616]/75 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-60 bg-linear-to-t from-[#080616] to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-24">
          <div className="max-w-2xl">
            {isLoadingMovies ? (
              <p className="text-lg text-slate-300">Cargando película destacada...</p>
            ) : heroMovie ? (
              <>
                <span className="rounded-full bg-[#2F2FE4] px-3 py-1 text-xs font-semibold shadow-md shadow-[#2F2FE4]/30 sm:text-sm">⭐ {heroMovie.score}</span>
                <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:mt-6 sm:text-5xl lg:text-6xl">{heroMovie.title}</h1>
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-300 sm:mt-4 sm:gap-4 sm:text-base">
                  <span>{heroMovie.genre}</span><span>•</span><span>{heroMovie.duration} min</span><span>•</span><span>{heroMovie.rating}</span>
                </div>
                <p className="mt-5 text-sm leading-6 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">Dirigida por {heroMovie.director}. Disponible en {heroMovie.languages.join(", ")}.</p>
                <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
                  <button className="flex items-center gap-2 rounded-lg bg-[#2F2FE4] px-5 py-3 text-sm font-semibold shadow-md shadow-[#2F2FE4]/30 transition hover:bg-[#162E93] sm:px-6 sm:text-base"><Play size={18} />Ver ahora</button>
                  <button className="rounded-lg border border-[#162E93] bg-[#1A1953]/60 p-3 backdrop-blur transition hover:border-[#2F2FE4] hover:bg-[#162E93]/50"><Plus /></button>
                  <button className="rounded-lg border border-[#162E93] bg-[#1A1953]/60 p-3 backdrop-blur transition hover:border-[#2F2FE4] hover:bg-[#162E93]/50"><Heart /></button>
                </div>
                <div className="mt-6 flex gap-2 sm:mt-8 sm:gap-3">
                  {movies.map((movie, index) => (
                    <button key={movie.id} onClick={() => setCurrentMovie(index)} className={`h-3 w-3 rounded-full transition ${currentMovie === index ? "w-8 bg-[#2F2FE4]" : "bg-slate-400/50 hover:bg-slate-200"}`} />
                  ))}
                </div>
              </>
            ) : (
              <p className="text-lg text-slate-300">No hay películas destacadas disponibles.</p>
            )}
          </div>
        </div>
      </section>
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
                <div className="p-4"><h3 className="text-xl font-bold text-white">{movie.title}</h3><p className="mt-2 text-xs text-slate-400">{movie.genre} · {movie.duration} min · {movie.rating}</p><div className="mt-3 flex flex-wrap gap-1.5">{movie.formats.map((format) => <span key={format} className="rounded border border-[#2F2FE4]/40 bg-[#2F2FE4]/10 px-2 py-0.5 text-[10px] font-bold text-[#8E8EFF]">{format}</span>)}</div></div>
              </article>
            ))}
          </div>
        ) : <p className="rounded-2xl border border-dashed border-[#162E93]/50 py-12 text-center text-slate-400">Aún no hay próximos estrenos anunciados.</p>}
      </section>
    </main>
  );
};
