import { useCallback, useEffect, useMemo, useState } from "react";
import { Play, Star, Clock, Calendar, Search, Heart, User } from "lucide-react";
import { useNavigate } from "react-router";
import { getMovies, getShowtimes } from "@/features/billboard/services/billboardService";
import { BillboardSection } from "@/features/billboard/components/BillboardSection";
import type { Movie, Showtime } from "@/features/billboard/types/billboard.types";
import { useAuthStore } from "@/features/auth/store/authStore";
import { getLocations, type CountryLocation } from "@/services/api";

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m < 10 ? "0" : ""}${m}m`;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function formatTime(time: string): string {
  return time;
}

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [currentMovie, setCurrentMovie] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  const [locations, setLocations] = useState<CountryLocation[]>([]);
  const [selectedCity, setSelectedCity] = useState(() => localStorage.getItem("lumi_ciudad") || "");
  const [countdown, setCountdown] = useState("--:--:--");

  useEffect(() => {
    let isMounted = true;

    const loadMovies = async () => {
      try {
        const [movieData, showtimeData] = await Promise.all([getMovies(), getShowtimes()]);
        if (isMounted) {
          setMovies(movieData);
          setShowtimes(showtimeData);
        }
      } finally {
        if (isMounted) setIsLoadingMovies(false);
      }
    };

    void loadMovies();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    getLocations().then((data) => {
      if (isMounted) setLocations(data);
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const update = () => setSelectedCity(localStorage.getItem("lumi_ciudad") || "");
    window.addEventListener("lumi-location-changed", update);
    return () => window.removeEventListener("lumi-location-changed", update);
  }, []);

  const cityCinemaIds = useMemo(() => {
    if (!selectedCity || !locations.length) return null;
    for (const country of locations) {
      for (const dept of country.departamentos) {
        const city = dept.ciudades.find((c) => c.nombre === selectedCity);
        if (city) return new Set(city.cines.map((cinema) => cinema.id));
      }
    }
    return null;
  }, [locations, selectedCity]);

  const heroMovies = useMemo(() => {
    const activeMovies = movies.filter((m) => m.isActive);
    if (!selectedCity || !cityCinemaIds) return activeMovies;
    return activeMovies.filter((movie) =>
      showtimes.some((st) => st.movieId === movie.id && cityCinemaIds.has(st.cinemaId))
    );
  }, [movies, showtimes, selectedCity, cityCinemaIds]);

  const showtimeCountForMovie = useCallback(
    (movieId: string) => {
      if (cityCinemaIds) {
        return showtimes.filter(
          (st) => st.movieId === movieId && cityCinemaIds.has(st.cinemaId)
        ).length;
      }
      return showtimes.filter((st) => st.movieId === movieId).length;
    },
    [showtimes, cityCinemaIds]
  );

  const nextShowtimeForMovie = useCallback(
    (movieId: string): Showtime | null => {
      const now = new Date();
      const relevant = cityCinemaIds
        ? showtimes.filter((st) => st.movieId === movieId && cityCinemaIds.has(st.cinemaId))
        : showtimes.filter((st) => st.movieId === movieId);
      const future = relevant
        .map((st) => ({ st, dt: new Date(`${st.date}T${st.time}:00`) }))
        .filter(({ dt }) => dt > now)
        .sort((a, b) => a.dt.getTime() - b.dt.getTime());
      return future.length > 0 ? future[0].st : null;
    },
    [showtimes, cityCinemaIds]
  );

  useEffect(() => {
    setCurrentMovie(0);
  }, [heroMovies.length]);

  const nextMovie = useCallback(() => {
    setCurrentMovie((previous) =>
      heroMovies.length ? (previous + 1) % heroMovies.length : 0
    );
  }, [heroMovies.length]);

  const previousMovie = useCallback(() => {
    setCurrentMovie((previous) =>
      heroMovies.length ? (previous - 1 + heroMovies.length) % heroMovies.length : 0
    );
  }, [heroMovies.length]);

  useEffect(() => {
    let blocked = false;
    const handleWheel = (event: WheelEvent) => {
      if (blocked || !heroMovies.length) return;
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
  }, [heroMovies.length, nextMovie, previousMovie]);

  const heroMovie = heroMovies[currentMovie];
  const heroShowtimeCount = heroMovie ? showtimeCountForMovie(heroMovie.id) : 0;
  const heroNextShowtime = heroMovie ? nextShowtimeForMovie(heroMovie.id) : null;

  const thumbnailMovies = useMemo(
    () => heroMovies.filter((m) => m.id !== heroMovie?.id).slice(0, 6),
    [heroMovies, heroMovie?.id]
  );

  useEffect(() => {
    if (!heroNextShowtime) {
      setCountdown("--:--:--");
      return;
    }
    const tick = () => {
      const now = new Date();
      const target = new Date(`${heroNextShowtime.date}T${heroNextShowtime.time}:00`);
      const diff = target.getTime() - now.getTime();
      setCountdown(diff > 0 ? formatCountdown(diff) : "00:00:00");
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [heroNextShowtime]);

  const upcomingMovies = movies.filter((movie) => {
    const movieShowtimes = showtimes.filter((showtime) => showtime.movieId === movie.id);
    return movieShowtimes.length > 0 && movieShowtimes.every((showtime) => showtime.status === "Próximamente");
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <section id="hero" className="relative h-screen w-full overflow-hidden bg-black">
        {heroMovie && (
          <img
            key={heroMovie.id}
            src={heroMovie.poster}
            alt={heroMovie.title}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-700"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-black/30" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 font-mono text-sm backdrop-blur-md">
                <Clock size={14} className="animate-countdown-pulse text-white/70" />
                <span className="tabular-nums tracking-wider">{countdown}</span>
              </div>
              {heroNextShowtime && (
                <span className="hidden text-xs text-white/50 sm:inline">
                  {formatTime(heroNextShowtime.time)} · {heroNextShowtime.format}
                </span>
              )}
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="text-2xl font-extrabold tracking-wide text-white">
                <span>Lumi</span><span className="text-[#2F2FE4]">Films</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="rounded-full border border-white/15 bg-white/10 p-2.5 backdrop-blur-md transition hover:bg-white/20"
                aria-label="Buscar"
              >
                <Search size={18} />
              </button>
              <button
                className="rounded-full border border-white/15 bg-white/10 p-2.5 backdrop-blur-md transition hover:bg-white/20"
                aria-label="Favoritos"
              >
                <Heart size={18} />
              </button>
              <button
                onClick={() => navigate(isAuthenticated ? "/perfil" : "/login")}
                className="rounded-full border border-white/15 bg-white/10 p-2.5 backdrop-blur-md transition hover:bg-white/20"
                aria-label={isAuthenticated ? "Mi perfil" : "Iniciar sesión"}
              >
                <User size={18} />
              </button>
            </div>
          </div>

          {heroMovie && (
            <div className="grid grid-cols-[auto_1fr_auto] items-end gap-6 pb-12 sm:gap-10 lg:gap-16">
              <div className="hidden flex-col items-center gap-5 md:flex">
                <div className="flex flex-col items-center gap-1">
                  <Star size={18} className="fill-white text-white" />
                  <span className="font-mono text-lg font-bold tabular-nums">{(heroMovie.score / 2).toFixed(1)}</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/40">Score</span>
                </div>
                <div className="h-px w-6 bg-white/20" />
                <div className="flex flex-col items-center gap-1">
                  <Calendar size={18} className="text-white/70" />
                  <span className="font-mono text-lg font-bold tabular-nums">{heroShowtimeCount}</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/40">Fn.</span>
                </div>
                <div className="h-px w-6 bg-white/20" />
                <div className="flex flex-col items-center gap-1">
                  <Clock size={18} className="text-white/70" />
                  <span className="font-mono text-sm font-bold tabular-nums">{formatDuration(heroMovie.duration)}</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/40">Dur.</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 pb-4 lg:items-start">
                <div className="flex items-end gap-3 md:hidden">
                  <Star size={14} className="fill-white text-white" />
                  <span className="font-mono text-sm font-bold">{(heroMovie.score / 2).toFixed(1)}</span>
                  <span className="text-white/30">|</span>
                  <Calendar size={14} className="text-white/70" />
                  <span className="font-mono text-sm font-bold">{heroShowtimeCount} fn.</span>
                  <span className="text-white/30">|</span>
                  <Clock size={14} className="text-white/70" />
                  <span className="font-mono text-sm font-bold">{formatDuration(heroMovie.duration)}</span>
                </div>

                <div className="text-center lg:text-left animate-hero-fade" key={`info-${heroMovie.id}`}>
                  <div className="flex items-baseline gap-3 justify-center lg:justify-start">
                    <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                      {heroMovie.title}
                    </h1>
                    <span className="font-mono text-lg font-semibold text-white/40 sm:text-xl">{heroMovie.year}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/60 justify-center lg:justify-start">
                    <span>{heroMovie.genre}</span>
                    <span className="text-white/20">·</span>
                    <span>{heroMovie.rating}</span>
                    <span className="text-white/20">·</span>
                    <span>Dir. {heroMovie.director}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/Movie/${heroMovie.id}`)}
                  className="group flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/35 sm:h-20 sm:w-20 animate-hero-fade-delayed"
                >
                  <Play size={28} className="ml-1 fill-white text-white transition-transform group-hover:scale-110 sm:ml-1.5 sm:h-8 sm:w-8" />
                </button>
              </div>

              <div className="hidden flex-col items-end gap-5 lg:flex lg:min-w-[220px] xl:min-w-[260px]">
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="rounded-full bg-[#2F2FE4] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                      Estreno
                    </span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/70">
                      {heroNextShowtime?.format || "2D"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 w-full">
                  {thumbnailMovies.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={() => {
                        const idx = heroMovies.findIndex((m) => m.id === movie.id);
                        if (idx >= 0) setCurrentMovie(idx);
                      }}
                      className="group relative aspect-[2/3] overflow-hidden rounded-lg border-2 border-transparent transition-all duration-200 hover:border-white/60 hover:scale-105"
                    >
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
                    </button>
                  ))}
                </div>

                {heroNextShowtime && (
                  <div className="w-full mt-1">
                    <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-white/40">
                      <span>{formatTime(heroNextShowtime.time)}</span>
                      <span>{heroNextShowtime.date}</span>
                    </div>
                    <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/15">
                      <div
                        className="absolute left-0 top-0 h-full rounded-full bg-white animate-progress-fill"
                        style={{ width: `${Math.min(((24 * 3600 - 0) / (24 * 3600)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {heroMovie && (
            <div className="flex items-center gap-2 pb-2 justify-center lg:justify-start lg:absolute lg:bottom-6 lg:left-1/2 lg:-translate-x-1/2">
              {heroMovies.map((movie, index) => (
                <button
                  key={movie.id}
                  onClick={() => setCurrentMovie(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentMovie === index
                      ? "w-8 bg-white"
                      : "w-2.5 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {!heroMovie && !isLoadingMovies && (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-lg text-white/50">No hay películas destacadas disponibles.</p>
            </div>
          )}

          {isLoadingMovies && (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-lg text-white/50">Cargando película destacada...</p>
            </div>
          )}
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
                <div className="relative aspect-4/5">
                  <img src={movie.poster} alt={movie.title} className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-[#2F2FE4] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">Próximamente</span>
                </div>
                <div className="p-4">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-xl font-bold text-white">{movie.title}</h3>
                    <span className="font-mono text-sm text-slate-500">{movie.year}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{movie.genre} · {movie.duration} min · {movie.rating}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-[#162E93]/50 py-12 text-center text-slate-400">
            Aún no hay próximos estrenos anunciados.
          </p>
        )}
      </section>
    </main>
  );
};
