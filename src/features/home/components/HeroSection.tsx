import React from "react";
import { useNavigate } from "react-router";
import { MapPin } from "lucide-react";
import { useHeroCarousel } from "../hooks/useHeroCarousel";
import { HeroBackground } from "./HeroBackground";
import { HeroContent } from "./HeroContent";
import { HeroNavigation } from "./HeroNavigation";
import { HeroStatsBar } from "./HeroStatsBar";
import type { HeroSectionProps } from "@/features/home/types/hero.types";

export const HeroSection: React.FC<HeroSectionProps> = ({
    movies,
    isLoading,
    onSelectMovie,
}) => {
    const navigate = useNavigate();
    const {
        activeMovie,
        activeMovieIndex,
        goToNextMovie,
        goToPreviousMovie,
        handleTouchStart,
        handleTouchEnd,
        setActiveMovieIndex,
    } = useHeroCarousel({ movies, intervalMs: 20000 });

    const handleViewShowtimes = () => {
        if (onSelectMovie) {
            onSelectMovie(activeMovie);
        }

        navigate(`/Movie/${activeMovie.id}`);
    };

    if (isLoading) {
        return (
            <section className="relative z-10 flex min-h-[80vh] items-center justify-center">
                <div className="animate-pulse text-slate-400">Cargando la cartelera de la sede...</div>
            </section>
        );
    }

    if (!movies || movies.length === 0) {
        return (
            <section className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 rounded-full border border-[#2F2FE4] bg-[#162E93]/30 p-4">
                    <MapPin className="h-8 w-8 text-amber-400" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-white">Sin funciones disponibles en esta sede</h2>
                <p className="max-w-md text-sm text-slate-400">
                    No hay funciones registradas para la ubicación elegida. Selecciona otra sede en el menú superior para consultar la cartelera disponible.
                </p>
            </section>
        );
    }

    return (
        <div className="relative w-full overflow-hidden bg-[#0A071E] text-white">
            <section
                className="relative flex min-h-[85vh] flex-col justify-between overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <HeroBackground movie={activeMovie} activeMovieIndex={activeMovieIndex} />

                <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-12 pt-28">
                    <HeroContent movie={activeMovie} onViewShowtimes={handleViewShowtimes} />
                </div>

                <HeroNavigation
                    movies={movies}
                    activeMovieIndex={activeMovieIndex}
                    onSelectMovie={setActiveMovieIndex}
                    onPrevious={goToPreviousMovie}
                    onNext={goToNextMovie}
                />
            </section>

            <HeroStatsBar />
        </div>
    );
};