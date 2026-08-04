import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movies } from "@/shared/data/movies";

interface CatalogCarouselProps {
  currentMovie: number;
  onSelectMovie: (index: number) => void;
}

export const CatalogCarousel = ({ currentMovie, onSelectMovie }: CatalogCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Navegación con scroll infinito simulado
  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    const scrollAmount = 240;

    if (direction === "right") {
      // Si llega al final del scroll, vuelve al inicio
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    } else {
      // Si está en el inicio, salta al final
      if (scrollLeft <= 10) {
        containerRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
      } else {
        containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section id="multicine" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold sm:text-3xl">Explorar Catálogo</h2>

        {/* Botones de Navegación */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#162E93] bg-[#1A1953]/60 text-white backdrop-blur transition hover:border-[#2F2FE4] hover:bg-[#2F2FE4]"
            aria-label="Anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#162E93] bg-[#1A1953]/60 text-white backdrop-blur transition hover:border-[#2F2FE4] hover:bg-[#2F2FE4]"
            aria-label="Siguiente"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Contenedor del Carrusel (Sin Scrollbar gris visible) */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-none sm:gap-6 [-ms-overflow-style:none]"
      >
        {Movies.map((movie, index) => (
          <div
            key={movie.id}
            onClick={() => onSelectMovie(index)}
            className={`min-w-45 shrink-0 cursor-pointer overflow-hidden rounded-xl transition duration-300 hover:scale-105 sm:min-w-55 ${
              currentMovie === index
                ? "ring-4 ring-[#2F2FE4]"
                : "border border-[#162E93]/40 bg-[#1A1953]/50 hover:border-[#2F2FE4]"
            }`}
          >
            <img
              src={movie.imagen}
              alt={movie.titulo}
              className="h-56 w-full object-cover sm:h-72"
            />

            <div className="p-3 sm:p-4">
              <h3 className="truncate font-semibold">{movie.titulo}</h3>

              <p className="mt-2 text-sm text-[#8E8EFF]">
                ⭐ {movie.puntuacion}
              </p>

              <p className="text-sm text-slate-400">
                {movie.genero}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};