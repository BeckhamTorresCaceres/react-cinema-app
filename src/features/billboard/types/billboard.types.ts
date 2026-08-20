// Definicion de los tipos de datos para el componente Billboard

export interface Showtime {
    id: string;
    movieId: string;
    cinemaId: string;
    /** Fecha local de la función en formato ISO: YYYY-MM-DD. */
    date: string;
    time: string; // Formato de hora, por ejemplo: "14:30"
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
    year: number; // Año de estreno de la película
    isActive: boolean; // Indica si la película está activa en cartelera
    cityId?: string; // ID de la ciudad donde se proyecta la película (opcional)
}

export type MovieWithShowtimes = Movie & {
    showtimes: Showtime[];
};


export interface BillboardFilters {
    date: string;
    city: string;
    genre: string;
    rating: string;
    language: string;
    format: string;
    cinema: string;
    availableOnly: boolean;
}
