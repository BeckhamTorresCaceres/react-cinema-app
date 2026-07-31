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
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative h-screen overflow-hidden">
        <img
          key={heroMovie.id}
          src={heroMovie.imagen}
          alt={heroMovie.titulo}
          className="absolute inset-0 h-full w-full object-cover transition-all duration-700"
        />

        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-black to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-8 pb-24">
          <div className="max-w-2xl">
            <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-semibold">
              ⭐ {heroMovie.puntuacion}
            </span>

            <h1 className="mt-6 text-6xl font-extrabold">
              {heroMovie.titulo}
            </h1>

            <div className="mt-4 flex flex-wrap gap-4 text-gray-300">
              <span>{heroMovie.anio}</span>
              <span>•</span>
              <span>{heroMovie.genero}</span>
              <span>•</span>
              <span>{heroMovie.duracion} min</span>
            </div>

            <p className="mt-6 text-lg leading-8 text-gray-300">
              {heroMovie.descripcion}
            </p>

            <div className="mt-8 flex gap-4">
              <button className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700">
                <Play size={18} />
                Ver ahora
              </button>

              <button className="rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur transition hover:bg-white/20">
                <Plus />
              </button>

              <button className="rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur transition hover:bg-white/20">
                <Heart />
              </button>
            </div>

            {/* Indicadores */}
            <div className="mt-8 flex gap-3">
              {Movies.map((movie, index) => (
                <button
                  key={movie.id}
                  onClick={() => setCurrentMovie(index)}
                  className={`h-3 w-3 rounded-full transition ${
                    currentMovie === index
                      ? "bg-red-600 w-8"
                      : "bg-white/40 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PELÍCULAS */}
      <section className="mx-auto max-w-7xl px-8 py-16">
        <h2 className="mb-8 text-3xl font-bold">
          Películas Populares
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Movies.map((movie, index) => (
            <div
              key={movie.id}
              onClick={() => setCurrentMovie(index)}
              className="group cursor-pointer overflow-hidden rounded-xl bg-zinc-900 transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="overflow-hidden">
                <img
                  src={movie.imagen}
                  alt={movie.titulo}
                  className="h-80 w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">
                    {movie.titulo}
                  </h3>

                  <span className="text-yellow-400">
                    ⭐ {movie.puntuacion}
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-400">
                  {movie.anio} • {movie.genero}
                </p>

                <p className="mt-2 line-clamp-3 text-sm text-gray-500">
                  {movie.descripcion}
                </p>

                <button className="mt-5 w-full rounded-lg bg-red-600 py-2 font-semibold transition hover:bg-red-700">
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CARRUSEL */}
      <section className="mx-auto max-w-7xl px-8 pb-20">
        <h2 className="mb-8 text-3xl font-bold">
          Explorar Catálogo
        </h2>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {Movies.map((movie, index) => (
            <div
              key={movie.id}
              onClick={() => setCurrentMovie(index)}
              className={`min-w-[220px] cursor-pointer overflow-hidden rounded-xl transition duration-300 hover:scale-105 ${
                currentMovie === index
                  ? "ring-4 ring-red-600"
                  : "bg-zinc-900"
              }`}
            >
              <img
                src={movie.imagen}
                alt={movie.titulo}
                className="h-72 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="font-semibold">{movie.titulo}</h3>

                <p className="mt-2 text-sm text-gray-400">
                  ⭐ {movie.puntuacion}
                </p>

                <p className="text-sm text-gray-500">
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