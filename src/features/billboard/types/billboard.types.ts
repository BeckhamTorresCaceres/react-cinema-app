import type { CinemaLocation } from "@/features/locations/types/location.types";

// Definicion de los tipos de datos para el componente Billboard

export interface Showtime {
    id: string;
    movieId: string;
    cinemaId: string;
    roomId: string;
    /** Fecha local de la función en formato ISO: YYYY-MM-DD. */
    date: string;
    time: string; // Formato de hora, por ejemplo: "14:30"
    price: number;
    occupiedSeats: string[];
    format: "2D" | "3D" | "IMAX" | "4DX"; // Formato de la película
    language: "Español" | "Inglés" | "Subtitulada"; // Idioma de la película    
    status: "Estreno" | "Próximamente"; // Estado de publicación de la función
    isSoldOut: boolean; // Indica si la función está agotada
}

export interface Movie {
    id: string;
    title: string; // Título de la película;
    poster: string; // URL del póster de la película
    trailer: string; // URL embebible del tráiler
    banner?: string; // URL del banner de la película (opcional)
    genre: string; // Género de la película
    rating: string; // Clasificación de la película, por ejemplo: "PG-13"
    duration: number; // Duración de la película en minutos
    director: string;
    score: number;
    isActive: boolean; // Indica si la película está activa en cartelera
    cityId?: string; // ID de la ciudad donde se proyecta la película (opcional)
}

export type MovieWithShowtimes = Movie & {
    showtimes: Showtime[];
};


export type MovieRecord = Movie;

export interface ShowtimesSelectorProps {
  movieId: string;
  showtimes: Showtime[];
  city: string;
  cinemas: CinemaLocation[];
  isLoadingCinemas?: boolean;
}

export interface DateSelectorProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

export interface MovieCardProps {
  movie: MovieWithShowtimes;
  onBuyTickets?: (movieId: string, showtimeId: string) => void;
}

export interface FilterState {
  searchTerm: string;
  genre: string;
  format: string;
  rating: string;
  language: string;
  complex: string;
}

export interface BillboardFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  complexes: CinemaLocation[];
  isLoadingComplexes?: boolean;
  genres: string[];
  formats: string[];
  ratings: string[];
  languages: string[];
}
