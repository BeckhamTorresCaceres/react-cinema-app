import type { HeroBackgroundProps } from "@/features/home/types/hero.types";

export const HeroBackground = ({ movie, activeMovieIndex }: HeroBackgroundProps) => {
  return (
    <div className="pointer-events-none absolute inset-0 bg-[#0A071E]">
      <img
        src={movie.poster}
        alt={movie.title}
        className="h-full w-full scale-105 object-cover opacity-90 blur-[0.25px] transition-all duration-700 ease-out"
        style={{ transform: `scale(1.08) translateX(${activeMovieIndex % 2 === 0 ? 0 : 8}px)` }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#0A071E]/80 via-[#0A071E]/55 to-[#0A071E]/18" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A071E]/75 via-[#0A071E]/15 to-transparent" />
    </div>
  );
};
