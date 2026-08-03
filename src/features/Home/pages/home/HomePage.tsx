import { useCallback, useEffect, useState } from "react";
import { Play, Plus, Heart } from "lucide-react";
import { Movies } from "../../../../shared/data/movies";

export const HomePage = () => {
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
      <section id="ubicacion" className="relative h-[calc(100svh-4rem)] min-h-[570px] overflow-hidden sm:min-h-[620px]">
        <img
          key={heroMovie.id}
          src={heroMovie.imagen}
          alt={heroMovie.titulo}
          className="absolute inset-0 h-full w-full object-cover transition-all duration-700"
        />

        <div className="absolute inset-0 bg-[#080616]/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080616] via-[#080616]/75 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-[#080616] to-transparent" />

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
      <section id="cartelera" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">
          Películas Populares
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {Movies.map((movie, index) => (
            <div
              key={movie.id}
              onClick={() => setCurrentMovie(index)}
              className="group cursor-pointer overflow-hidden rounded-xl border border-[#162E93]/40 bg-[#1A1953]/50 transition duration-300 hover:-translate-y-2 hover:border-[#2F2FE4] hover:shadow-2xl hover:shadow-[#080616]"
            >
              <div className="overflow-hidden">
                <img
                  src={movie.imagen}
                  alt={movie.titulo}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-110 sm:h-80"
                />
              </div>

              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">
                    {movie.titulo}
                  </h3>

                  <span className="text-[#8E8EFF]">
                    ⭐ {movie.puntuacion}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-300">
                  {movie.anio} • {movie.genero}
                </p>

                <p className="mt-2 line-clamp-3 text-sm text-slate-400">
                  {movie.descripcion}
                </p>

                <button className="mt-5 w-full rounded-lg bg-[#2F2FE4] py-2 font-semibold transition hover:bg-[#162E93]">
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CARRUSEL */}
      <section id="multicine" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <h2 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">
          Explorar Catálogo
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4 sm:gap-6">
          {Movies.map((movie, index) => (
            <div
              key={movie.id}
              onClick={() => setCurrentMovie(index)}
              className={`min-w-[180px] cursor-pointer overflow-hidden rounded-xl transition duration-300 hover:scale-105 sm:min-w-[220px] ${
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
                <h3 className="font-semibold">{movie.titulo}</h3>

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
    </main>
  );
};
