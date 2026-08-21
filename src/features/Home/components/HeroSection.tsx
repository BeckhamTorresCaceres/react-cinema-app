import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, Plus } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";

import { getLocations, type CountryLocation } from "@/services/api";
import { getSavedLocation } from "@/utils/location";
import { getYouTubeVideoId } from "@/utils/youtube";
import { FilmProjectorTransition } from "@/components/FilmProjector/FilmProjectorTransition";
import type { Movie, Showtime } from "@/features/billboard/types/billboard.types";

interface HeroSectionProps {
  allMovies: Movie[];
  showtimes: Showtime[];
}

const MOBILE_ROTATION_MS = 5000;
const HOVER_DEBOUNCE_MS = 350;
const THROTTLE_MS = 500;
const SWIPE_THRESHOLD = 50;

const CELL_BORDER = 2;

export const HeroSection = ({ allMovies, showtimes }: HeroSectionProps) => {
  const { isAuthenticated } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [locations, setLocations] = useState<CountryLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState(getSavedLocation);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevVideoIdRef = useRef<string | null>(null);
  const mobileRotation = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastChangeRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const viewport = trackRef.current;
    if (!viewport) return;
    const measure = () => setContainerWidth(viewport.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const handler = () => setSelectedLocation(getSavedLocation());
    window.addEventListener("lumi-location-changed", handler);
    return () => window.removeEventListener("lumi-location-changed", handler);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    getLocations().then(setLocations);
  }, [isAuthenticated]);

  const heroMovies = useMemo<Movie[]>(() => {
    if (!isAuthenticated || !selectedLocation.city || !locations.length) {
      return allMovies;
    }

    const country = locations.find((l) => l.nombre === selectedLocation.country);
    const dept = country?.departamentos.find((d) => d.nombre === selectedLocation.department);
    const city = dept?.ciudades.find((c) => c.nombre === selectedLocation.city);
    const cinemaIds = new Set(city?.cines.map((c) => c.id) ?? []);

    const filtered = allMovies.filter((movie) =>
      showtimes.some(
        (st) =>
          st.movieId === movie.id &&
          st.status === "Estreno" &&
          cinemaIds.has(st.cinemaId)
      )
    );

    return filtered.length > 0 ? filtered : allMovies;
  }, [isAuthenticated, selectedLocation, locations, allMovies, showtimes]);

  const safeIndex = currentIndex >= heroMovies.length ? 0 : currentIndex;

  const restartMobileRotation = useCallback(() => {
    if (mobileRotation.current) clearInterval(mobileRotation.current);
    if (isMobile && heroMovies.length > 1) {
      mobileRotation.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
      }, MOBILE_ROTATION_MS);
    }
  }, [isMobile, heroMovies.length]);

  useEffect(() => {
    restartMobileRotation();
    return () => {
      if (mobileRotation.current) clearInterval(mobileRotation.current);
    };
  }, [restartMobileRotation]);

  const goToMovie = useCallback(
    (index: number) => {
      const now = Date.now();
      if (now - lastChangeRef.current < THROTTLE_MS) return;
      lastChangeRef.current = now;

      setCurrentIndex(index);
      restartMobileRotation();
    },
    [restartMobileRotation]
  );

  const handleThumbnailHover = useCallback(
    (index: number) => {
      if (isMobile) return;
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      hoverTimeout.current = setTimeout(() => goToMovie(index), HOVER_DEBOUNCE_MS);
    },
    [isMobile, goToMovie]
  );

  const handleThumbnailLeave = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      if (mobileRotation.current) clearInterval(mobileRotation.current);
    };
  }, []);

  const heroMovie = heroMovies[safeIndex];
  const videoId = heroMovie ? getYouTubeVideoId(heroMovie.trailer) : null;

  // Trigger projector transition when video changes (not on first render)
  useEffect(() => {
    if (prevVideoIdRef.current !== null && prevVideoIdRef.current !== videoId) {
      setIsTransitioning(true);
    }
    prevVideoIdRef.current = videoId;
  }, [videoId]);

  useEffect(() => {
    if (heroMovies.length <= 1) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goToMovie((safeIndex + 1) % heroMovies.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToMovie((safeIndex - 1 + heroMovies.length) % heroMovies.length);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [safeIndex, heroMovies.length, goToMovie]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const delta = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(delta) < SWIPE_THRESHOLD) return;
      if (delta > 0) {
        goToMovie((safeIndex + 1) % heroMovies.length);
      } else {
        goToMovie((safeIndex - 1 + heroMovies.length) % heroMovies.length);
      }
    },
    [safeIndex, heroMovies.length, goToMovie]
  );

  const cellWidth = isMobile ? 200 : 240;
  const cellGap = 20;
  const cellStep = cellWidth + cellGap;
  const totalTrackWidth = heroMovies.length * cellWidth + Math.max(0, heroMovies.length - 1) * cellGap;
  const rawOffset = safeIndex * cellStep;
  const maxScroll = Math.max(0, totalTrackWidth - containerWidth);
  const clampedScroll = Math.min(rawOffset, maxScroll);
  const centerOffset = (containerWidth - cellWidth) / 2;
  const translateX = centerOffset - clampedScroll;

  if (!heroMovie) {
    return (
      <section className="relative h-[calc(100svh-4rem)] min-h-142.5 overflow-hidden sm:min-h-155 bg-[#080616]">
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center justify-center px-4">
          <p className="text-lg text-slate-400">No hay películas destacadas disponibles.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[calc(100svh-4rem)] min-h-142.5 overflow-hidden sm:min-h-155">
      <div className="absolute inset-0 bottom-[200px] sm:bottom-[230px] overflow-hidden">
        {videoId ? (
          <iframe
            key={videoId}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
            className="absolute inset-0 h-full w-full object-cover scale-[1.35]"
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            frameBorder={0}
            title=""
          />
        ) : (
          <img
            key={heroMovie.id}
            src={heroMovie.poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-all duration-700"
          />
        )}

        <div className="absolute inset-0 bg-[#080616]/20" />
        <div className="absolute inset-0 bg-linear-to-t from-[#080616] via-[#080616]/40 to-transparent" />

        <FilmProjectorTransition
          active={isTransitioning}
          duration={2}
          onComplete={() => setIsTransitioning(false)}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[200px] sm:h-[230px] bg-linear-to-t from-[#080616] via-[#080616]/50 to-transparent z-[5]" />

      <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-end px-4 pb-56 text-center sm:px-6 sm:pb-60 lg:px-8 lg:pb-60">
        <div className="max-w-2xl">
          <span className="rounded-full bg-[#2F2FE4] px-3 py-1 text-xs font-semibold shadow-md shadow-[#2F2FE4]/30 sm:text-sm">
            ⭐ {heroMovie.score}
          </span>
          <h1
            key={heroMovie.id}
            className="mt-4 text-3xl font-extrabold leading-tight transition-opacity duration-300 sm:mt-5 sm:text-5xl lg:text-6xl"
          >
            {heroMovie.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-slate-300 sm:mt-4 sm:gap-4 sm:text-base">
            <span>{heroMovie.genre}</span>
            <span>•</span>
            <span>{heroMovie.duration} min</span>
            <span>•</span>
            <span>{heroMovie.rating}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300 sm:mt-4 sm:text-lg sm:leading-8">
            Dirigida por {heroMovie.director}.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:mt-6 sm:gap-4">
            <button className="flex items-center gap-2 rounded-lg bg-[#2F2FE4] px-5 py-3 text-sm font-semibold shadow-md shadow-[#2F2FE4]/30 transition hover:bg-[#162E93] sm:px-6 sm:text-base">
              <Play size={18} /> Ver trailer
            </button>
            <button className="rounded-lg border border-[#162E93] bg-[#1A1953]/60 p-3 backdrop-blur transition hover:border-[#2F2FE4] hover:bg-[#162E93]/50">
              <Plus />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="strip-track transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {heroMovies.map((movie, index) => {
            const isActive = index === safeIndex;
            return (
              <button
                key={movie.id}
                type="button"
                data-movie-id={movie.id}
                onClick={() => goToMovie(index)}
                onMouseEnter={() => handleThumbnailHover(index)}
                onMouseLeave={handleThumbnailLeave}
                className={`film-cell ${isActive ? "film-cell--active" : ""}`}
                aria-label={movie.title}
              >
                <img src={movie.poster} alt={movie.title} loading="lazy" />
                <span className="film-cell__title">{movie.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
