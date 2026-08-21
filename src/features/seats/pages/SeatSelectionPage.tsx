import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { getLocations, type CinemaLocation, type CountryLocation } from "@/services/api";
import { getMovieById, getShowtimeById } from "@/features/billboard/services/billboardService";
import type { Movie, Showtime } from "@/features/billboard/types/billboard.types";
import { SeatMap } from "../components/SeatMap";
import { getSeatOccupancy } from "../services/seatsService";
import { useBookingStore } from "../store/bookingStore";
import { formatCurrency, MAX_SELECTED_SEATS, SEATS_PER_ROW, SEAT_ROWS, seatId, TICKET_PRICE } from "../utils/seatLayout";

const LANGUAGE_SHORT: Record<Showtime["language"], string> = {
  Español: "DOB",
  Inglés: "ENG",
  Subtitulada: "SUB",
};

const findCinema = (locations: CountryLocation[], cinemaId: string): CinemaLocation | undefined => {
  for (const country of locations) {
    for (const department of country.departamentos) {
      for (const city of department.ciudades) {
        const cinema = city.cines.find((item) => item.id === cinemaId);
        if (cinema) return cinema;
      }
    }
  }
  return undefined;
};

const formatShowDate = (date: string, time: string) => {
  const dateLabel = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

  return `${dateLabel} · ${time}`;
};

export const SeatSelectionPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const movieId = searchParams.get("movieId") ?? "";
  const showtimeId = searchParams.get("showtimeId") ?? "";

  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [cinema, setCinema] = useState<CinemaLocation | null>(null);
  const [occupied, setOccupied] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const hasRequiredParams = Boolean(movieId && showtimeId);
  const [isLoading, setIsLoading] = useState(hasRequiredParams);
  const [error, setError] = useState<string | null>(hasRequiredParams ? null : "Falta la película o la función.");
  const setSelection = useBookingStore((state) => state.setSelection);

  useEffect(() => {
    let isMounted = true;

    if (!movieId || !showtimeId) return;

    Promise.all([
      getMovieById(movieId),
      getShowtimeById(showtimeId),
      getSeatOccupancy(showtimeId),
      getLocations(),
    ])
      .then(([fetchedMovie, fetchedShowtime, occupancy, locations]) => {
        if (!isMounted) return;
        if (fetchedShowtime.movieId !== movieId) {
          setError("La función no corresponde a esta película.");
          return;
        }

        setMovie(fetchedMovie);
        setShowtime(fetchedShowtime);
        setOccupied(occupancy);
        setCinema(findCinema(locations, fetchedShowtime.cinemaId) ?? null);
      })
      .catch(() => {
        if (isMounted) setError("No fue posible cargar la sala.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [movieId, showtimeId]);

  const occupiedSeats = useMemo(() => {
    if (!showtime?.isSoldOut) return occupied;
    return SEAT_ROWS.flatMap((row) =>
      Array.from({ length: SEATS_PER_ROW }, (_, index) => seatId(row, index + 1))
    );
  }, [occupied, showtime]);

  const toggleSeat = (seatId: string) => {
    if (showtime?.isSoldOut) return;

    setSelected((current) => {
      if (current.includes(seatId)) {
        return current.filter((id) => id !== seatId);
      }

      if (current.length >= MAX_SELECTED_SEATS) return current;
      return [...current, seatId].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    });
  };

  const continueToCheckout = () => {
    if (!movieId || !showtimeId || selected.length === 0) return;
    setSelection({ movieId, showtimeId, seats: selected });
    navigate(`/checkout?movieId=${movieId}&showtimeId=${showtimeId}&seats=${selected.join(",")}`);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#080616] px-6 py-20 text-center text-slate-300">
        Cargando sala...
      </main>
    );
  }

  if (error || !movie || !showtime) {
    return (
      <main className="min-h-screen bg-[#080616] px-6 py-20 text-center text-white">
        <h1 className="text-3xl font-bold">No encontramos esa función</h1>
        <p className="mt-3 text-slate-400">{error}</p>
        <Link to="/#cartelera" className="mt-6 inline-block text-[#8E8EFF] hover:underline">
          Volver a cartelera
        </Link>
      </main>
    );
  }

  const total = selected.length * TICKET_PRICE;

  return (
    <main className="min-h-screen bg-[#080616] pb-24 text-white">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          to={`/Movie/${movie.id}`}
          className="group inline-flex items-center gap-2 rounded-full border border-[#162E93]/40 bg-[#1A1953]/30 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-[#2F2FE4] hover:text-white"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Volver a la película
        </Link>
      </div>

      <div className="mx-auto mt-8 grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <section className="rounded-3xl border border-[#162E93]/40 bg-[#1A1953]/30 p-5 backdrop-blur-md sm:p-8">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8E8EFF]">Elige tus asientos</p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{movie.title}</h1>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-300">
              {cinema && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={15} className="text-[#8E8EFF]" />
                  {cinema.nombre}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock size={15} className="text-[#8E8EFF]" />
                {formatShowDate(showtime.date, showtime.time)}
              </span>
              <span className="rounded-full border border-[#2F2FE4]/40 bg-[#2F2FE4]/15 px-2.5 py-0.5 text-xs font-bold text-[#8E8EFF]">
                {showtime.format} · {LANGUAGE_SHORT[showtime.language]}
              </span>
            </div>
          </div>

          {showtime.isSoldOut && (
            <p className="mb-6 rounded-2xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">
              Esta función está agotada. No hay asientos disponibles.
            </p>
          )}

          <SeatMap
            occupied={occupiedSeats}
            selected={selected}
            onToggle={toggleSeat}
            disabled={showtime.isSoldOut}
          />
        </section>

        <aside className="h-fit rounded-3xl border border-[#162E93]/40 bg-[#1A1953]/40 p-6 backdrop-blur-md lg:sticky lg:top-24">
          <img
            src={movie.poster}
            alt={movie.title}
            className="mb-4 aspect-2/3 w-full rounded-2xl object-cover ring-1 ring-white/10"
          />
          <h2 className="text-lg font-bold">{movie.title}</h2>
          {cinema && <p className="mt-1 text-sm text-slate-400">{cinema.nombre}</p>}
          <p className="mt-1 text-sm text-slate-400">{formatShowDate(showtime.date, showtime.time)}</p>

          <div className="mt-5 border-t border-[#162E93]/40 pt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Asientos</p>
            {selected.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {selected.map((seat) => (
                  <span
                    key={seat}
                    className="rounded-lg border border-[#2F2FE4]/50 bg-[#2F2FE4]/20 px-2.5 py-1 text-sm font-semibold text-[#8E8EFF]"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Selecciona hasta {MAX_SELECTED_SEATS} asientos.</p>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="text-slate-400">{selected.length} entrada{selected.length === 1 ? "" : "s"}</span>
            <span className="text-lg font-bold text-white">{formatCurrency(total)}</span>
          </div>

          <button
            type="button"
            onClick={continueToCheckout}
            disabled={selected.length === 0 || showtime.isSoldOut}
            className="mt-5 w-full rounded-xl bg-[#2F2FE4] py-3 font-semibold text-white transition hover:bg-[#162E93] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar
          </button>
        </aside>
      </div>
    </main>
  );
};
