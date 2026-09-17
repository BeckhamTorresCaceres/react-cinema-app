import type { HeroNavigationProps } from "@/features/home/types/hero.types";

export const HeroNavigation = ({
  movies,
  activeMovieIndex,
  onSelectMovie,
  onPrevious,
  onNext,
}: HeroNavigationProps) => {
  return (
    <>
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:hidden">
        <button
          type="button"
          onClick={onPrevious}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg text-white backdrop-blur-md transition hover:bg-white/20"
          aria-label="Película anterior"
        >
          ←
        </button>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0A071E]/60 px-3 py-1.5 backdrop-blur-md">
          {movies.map((movie, index) => (
            <button
              key={movie.id}
              type="button"
              onClick={() => onSelectMovie(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeMovieIndex ? "w-8 bg-amber-400" : "w-2.5 bg-white/35"
              }`}
              aria-label={`Ver ${movie.title}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onNext}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg text-white backdrop-blur-md transition hover:bg-white/20"
          aria-label="Siguiente película"
        >
          →
        </button>
      </div>

      <div className="absolute bottom-12 right-6 z-20 hidden items-center gap-3 md:flex">
        <button
          type="button"
          onClick={onPrevious}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg text-white backdrop-blur-md transition hover:bg-white/20"
          aria-label="Película anterior"
        >
          ←
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg text-white backdrop-blur-md transition hover:bg-white/20"
          aria-label="Siguiente película"
        >
          →
        </button>
      </div>
    </>
  );
};
