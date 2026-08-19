import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Film, MapPin } from "lucide-react";
import { Link } from "react-router";
import type { Showtime } from "../types/billboard.types";
import type { CinemaLocation } from "@/services/api";

interface ShowtimesSelectorProps {
  movieId: string;
  showtimes: Showtime[];
  city: string;
  cinemas: CinemaLocation[];
  isLoadingCinemas?: boolean;
}

const LANGUAGE_SHORT: Record<Showtime["language"], string> = {
  Español: "DOB",
  Inglés: "ENG",
  Subtitulada: "SUB",
};

const formatDateChip = (dateStr: string) => {
  const dateObj = new Date(`${dateStr}T00:00:00Z`);
  const dayName = new Intl.DateTimeFormat("es-CO", { weekday: "short", timeZone: "UTC" })
    .format(dateObj)
    .replace(".", "")
    .toUpperCase();
  const dayNum = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", timeZone: "UTC" })
    .format(dateObj);

  return { dayName, dayNum };
};

const formatShowtime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .toLowerCase()
    .replace(/\s+/g, " ");
};

const formatLabel = (showtime: Showtime) =>
  `${showtime.format} - ${LANGUAGE_SHORT[showtime.language]}`;

export const ShowtimesSelector = ({
  movieId,
  showtimes,
  city,
  cinemas,
  isLoadingCinemas = false,
}: ShowtimesSelectorProps) => {
  const cinemaById = useMemo(
    () => new Map(cinemas.map((cinema) => [cinema.id, cinema])),
    [cinemas]
  );

  const availableDates = useMemo(
    () => Array.from(new Set(showtimes.map((showtime) => showtime.date))).sort(),
    [showtimes]
  );

  const [selectedDate, setSelectedDate] = useState("");
  const [openCinemaId, setOpenCinemaId] = useState<string | null>(null);

  useEffect(() => {
    if (!availableDates.includes(selectedDate)) {
      setSelectedDate(availableDates[0] || "");
    }
  }, [availableDates, selectedDate]);

  const selectedDateIndex = availableDates.indexOf(selectedDate);

  const goToPreviousDate = () => {
    if (selectedDateIndex > 0) setSelectedDate(availableDates[selectedDateIndex - 1]);
  };

  const goToNextDate = () => {
    if (selectedDateIndex >= 0 && selectedDateIndex < availableDates.length - 1) {
      setSelectedDate(availableDates[selectedDateIndex + 1]);
    }
  };

  const cinemaOptions = useMemo(() => {
    const groups = new Map<string, Record<string, Showtime[]>>();

    showtimes
      .filter((showtime) => showtime.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time))
      .forEach((showtime) => {
        const cinema = cinemaById.get(showtime.cinemaId);
        if (!cinema) return;

        const formats = groups.get(cinema.id) ?? {};
        const key = formatLabel(showtime);
        if (!formats[key]) formats[key] = [];
        formats[key].push(showtime);
        groups.set(cinema.id, formats);
      });

    return cinemas
      .filter((cinema) => groups.has(cinema.id))
      .map((cinema) => ({
        cinema,
        formats: groups.get(cinema.id) ?? {},
      }));
  }, [showtimes, selectedDate, cinemaById, cinemas]);

  useEffect(() => {
    if (!openCinemaId) return;
    if (!cinemaOptions.some(({ cinema }) => cinema.id === openCinemaId)) {
      setOpenCinemaId(null);
    }
  }, [cinemaOptions, openCinemaId]);

  const toggleCinema = (cinemaId: string) => {
    setOpenCinemaId((current) => (current === cinemaId ? null : cinemaId));
  };

  return (
    <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-8 w-1.5 rounded-full bg-[#2F2FE4]" />
        <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Horarios y funciones
          {city && <span className="text-[#8E8EFF]"> {city}</span>}
        </h2>
      </div>

      {isLoadingCinemas ? (
        <div className="rounded-3xl border border-[#162E93]/40 bg-[#1A1953]/20 p-12 text-center text-slate-400">
          Cargando cines de tu ubicación...
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 rounded-3xl border border-[#162E93]/40 bg-[#1A1953]/40 px-3 py-3 shadow-[0_0_30px_rgba(47,47,228,0.12)] backdrop-blur-md sm:px-4">
            <button
              type="button"
              onClick={goToPreviousDate}
              disabled={selectedDateIndex <= 0}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#2F2FE4]/40 bg-[#162E93] text-white shadow-lg shadow-[#2F2FE4]/20 transition hover:bg-[#2F2FE4] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Fecha anterior"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="flex flex-1 items-center justify-center gap-3 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {availableDates.map((dateStr) => {
                const { dayName, dayNum } = formatDateChip(dateStr);
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                    className={`flex min-w-[76px] flex-col overflow-hidden rounded-xl border transition duration-200 ${
                      isSelected
                        ? "scale-105 border-[#2F2FE4] shadow-lg shadow-[#2F2FE4]/30"
                        : "border-[#162E93]/50 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <span
                      className={`px-3 py-1 text-center text-[11px] font-bold tracking-wider ${
                        isSelected ? "bg-[#2F2FE4] text-white" : "bg-[#162E93]/80 text-slate-200"
                      }`}
                    >
                      {dayName}
                    </span>
                    <span className="bg-[#080616] px-3 py-2 text-center text-sm font-semibold text-white">
                      {dayNum}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={goToNextDate}
              disabled={selectedDateIndex < 0 || selectedDateIndex >= availableDates.length - 1}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#2F2FE4]/40 bg-[#162E93] text-white shadow-lg shadow-[#2F2FE4]/20 transition hover:bg-[#2F2FE4] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Fecha siguiente"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <div className="mt-5 overflow-hidden rounded-3xl border border-[#162E93]/40 bg-[#1A1953]/40 shadow-[0_0_40px_rgba(22,46,147,0.18)] backdrop-blur-md">
            {cinemaOptions.length > 0 ? (
              cinemaOptions.map(({ cinema, formats }, index) => {
                const isOpen = openCinemaId === cinema.id;

                return (
                  <div
                    key={cinema.id}
                    className={index > 0 ? "border-t border-[#162E93]/30" : ""}
                  >
                    <button
                      type="button"
                      onClick={() => toggleCinema(cinema.id)}
                      aria-expanded={isOpen}
                      className={`flex w-full items-center gap-4 px-5 py-4 text-left transition ${
                        isOpen ? "bg-[#2F2FE4]/10" : "hover:bg-[#162E93]/25"
                      }`}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2F2FE4]/40 bg-[#2F2FE4]/15 text-[#8E8EFF]">
                        <MapPin size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-base font-semibold text-white sm:text-lg">
                          {cinema.nombre}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-slate-400">
                          {cinema.direccion}
                        </span>
                      </span>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-white transition ${
                          isOpen
                            ? "border-[#2F2FE4] bg-[#2F2FE4] shadow-md shadow-[#2F2FE4]/40"
                            : "border-[#2F2FE4]/40 bg-[#162E93]"
                        }`}
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </span>
                    </button>

                    {isOpen && (
                      <div className="space-y-5 border-t border-[#162E93]/20 bg-[#080616]/50 px-5 py-5">
                        {Object.entries(formats).map(([label, times]) => (
                          <div key={label}>
                            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8E8EFF]">
                              <Film size={14} />
                              {label}
                            </p>
                            <div className="flex flex-wrap gap-3">
                              {times.map((showtime) => (
                                <Link
                                  key={showtime.id}
                                  to={`/asientos?movieId=${movieId}&showtimeId=${showtime.id}`}
                                  aria-disabled={showtime.isSoldOut}
                                  onClick={(event) => showtime.isSoldOut && event.preventDefault()}
                                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                                    showtime.isSoldOut
                                      ? "cursor-not-allowed border-red-900/30 bg-red-950/20 text-slate-500 line-through"
                                      : "border-[#162E93]/60 bg-[#1A1953]/60 text-slate-200 hover:border-[#2F2FE4] hover:bg-[#2F2FE4]/30 hover:text-white hover:shadow-lg hover:shadow-[#2F2FE4]/20"
                                  }`}
                                >
                                  {formatShowtime(showtime.time)}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="px-5 py-10 text-center text-slate-400">
                No hay funciones{city ? ` en ${city}` : ""} para la fecha seleccionada.
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
};
