import type { Movie } from "@/features/billboard/types/billboard.types";

export interface HeroSectionProps {
  movies: Movie[];
  isLoading: boolean;
  onSelectMovie?: (movie: Movie) => void;
}

export interface HeroBackgroundProps {
  movie: Movie;
  activeMovieIndex: number;
}

export interface HeroContentProps {
  movie: Movie;
  onViewShowtimes: () => void;
}

export interface HeroNavigationProps {
  movies: Movie[];
  activeMovieIndex: number;
  onSelectMovie: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}
