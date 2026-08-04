import { useCallback, useEffect, useState } from "react";
import { Play, Plus, Heart } from "lucide-react";
import { Movies } from "../../../../shared/data/movies";
import { BillboardSection } from "@/features/billboard/components/BillboardSection";
import { CatalogCarousel } from "@/features/Home/components/CatalogCarousel";

export const HomePage = () => {
  // Declaración del estado para la película activa del hero
  const [currentMovie, setCurrentMovie] = useState(0);

  const nextMovie = useCallback(() => {
    setCurrentMovie((prev) => (prev + 1) % Movies.length);
  }, []);

  const previousMovie = useCallback(() => {
    setCurrentMovie((prev) => (prev - 1 + Movies.length) % Movies.length);
  }, []);

  // Cambiar película con la rueda del mouse
  useEffect(() => {
    let blocked = false;

    const handleWheel = (event: WheelEvent) => {
      if (blocked) return;

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

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [nextMovie, previousMovie]);

  const heroMovie = Movies[currentMovie];

  return (
    <main className="min-h-screen bg-[#080616] text-white">
      {/* HERO */}
      <section id="ubicacion" className="relative h-[calc(100svh-4rem)] min-h-142.5 overflow-hidden sm:min-h-155">
        <img
          key={heroMovie.id}
          src={heroMovie.imagen}
          alt={heroMovie.titulo}
          className="absolute inset-0 h-full w-full object-cover transition-all duration-700"
        />

        <div className="absolute inset-0 bg-[#080616]/45" />
        <div className="absolute inset-0 bg-linear-to-r from-[#080616] via-[#080616]/75 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-60 bg-linear-to-t from-[#080616] to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-24">
          <div className="max-w-2xl">
            <span className="rounded-full bg-[#2F2FE4] px-3 py-1 text-xs font-semibold shadow-md shadow-[#2F2FE4]/30 sm:text-sm">
              ⭐ {heroMovie.puntuacion}
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:mt-6 sm:text-5xl lg:text-6xl">
              {heroMovie.titulo}
            </h1>

            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-300 sm:mt-4 sm:gap-4 sm:text-base">
              <span>{heroMovie.anio}</span>
              <span>•</span>
              <span>{heroMovie.genero}</span>
              <span>•</span>
              <span>{heroMovie.duracion} min</span>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
              {heroMovie.descripcion}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
              <button className="flex items-center gap-2 rounded-lg bg-[#2F2FE4] px-5 py-3 text-sm font-semibold shadow-md shadow-[#2F2FE4]/30 transition hover:bg-[#162E93] sm:px-6 sm:text-base">
                <Play size={18} />
                Ver ahora
              </button>

              <button className="rounded-lg border border-[#162E93] bg-[#1A1953]/60 p-3 backdrop-blur transition hover:border-[#2F2FE4] hover:bg-[#162E93]/50">
                <Plus />
              </button>

              <button className="rounded-lg border border-[#162E93] bg-[#1A1953]/60 p-3 backdrop-blur transition hover:border-[#2F2FE4] hover:bg-[#162E93]/50">
                <Heart />
              </button>
            </div>

            {/* Indicadores */}
            <div className="mt-6 flex gap-2 sm:mt-8 sm:gap-3">
              {Movies.map((movie, index) => (
                <button
                  key={movie.id}
                  onClick={() => setCurrentMovie(index)}
                  className={`h-3 w-3 rounded-full transition ${
                    currentMovie === index
                      ? "w-8 bg-[#2F2FE4]"
                      : "bg-slate-400/50 hover:bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PELÍCULAS */}
      <BillboardSection />

      {/* CARRUSEL */}
      <CatalogCarousel currentMovie={currentMovie} onSelectMovie={setCurrentMovie} />
    </main>
  );
};