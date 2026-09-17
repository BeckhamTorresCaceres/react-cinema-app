import { useEffect, useState } from "react";
import type { TouchEvent } from "react";
import type { Movie } from "@/features/billboard/types/billboard.types";

interface UseHeroCarouselOptions {
  movies: Movie[];
  intervalMs?: number;
}

export const useHeroCarousel = ({ movies, intervalMs = 20000 }: UseHeroCarouselOptions) => {
  const [activeMovieIndex, setActiveMovieIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  useEffect(() => {
    if (movies.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveMovieIndex((currentIndex) => (currentIndex + 1) % movies.length);
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [intervalMs, movies.length]);

  const goToNextMovie = () => {
    if (movies.length === 0) return;
    setActiveMovieIndex((currentIndex) => (currentIndex + 1) % movies.length);
  };

  const goToPreviousMovie = () => {
    if (movies.length === 0) return;
    setActiveMovieIndex((currentIndex) => (currentIndex - 1 + movies.length) % movies.length);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    setDragStartX(event.touches[0].clientX);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (dragStartX === null) return;

    const dragDistance = event.changedTouches[0].clientX - dragStartX;

    if (dragDistance > 60) {
      goToPreviousMovie();
    } else if (dragDistance < -60) {
      goToNextMovie();
    }

    setDragStartX(null);
  };

  const activeMovie = movies[activeMovieIndex] || movies[0];

  return {
    activeMovie,
    activeMovieIndex,
    dragStartX,
    goToNextMovie,
    goToPreviousMovie,
    handleTouchStart,
    handleTouchEnd,
    setActiveMovieIndex,
  };
};
