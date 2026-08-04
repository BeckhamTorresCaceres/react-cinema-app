// Definicion de los tipos de datos para el componente Billboard

export interface Showtime {
    id: string;
    time: string; // Formato de hora, por ejemplo: "14:30"
    format: "2D" | "3D" | "IMAX" | "4DX"; // Formato de la película
    language: "Español" | "Inglés" | "Subtitulada"; // Idioma de la película    
    isSoldOut: boolean; // Indica si la función está agotada
}

export interface Movie {
    id: string;
    title: string; // Título de la película;
    poster: string; // URL del póster de la película
    banner?: string; // URL del banner de la película (opcional)
    genre: string; // Género de la película
    rating: string; // Clasificación de la película, por ejemplo: "PG-13"
    duration: number; // Duración de la película en minutos
    director: string;
    languages: Array<"Español" | "Inglés" | "Subtitulada">; // Idiomas disponibles para la película
    formats: Array<"2D" | "3D" | "IMAX" | "4DX">; // Formatos disponibles para la película
    score: number;
    isReleased: boolean; // Indica si la película ya fue estrenada
    isActive: boolean; // Indica si la película está activa en cartelera
    showtimes: Showtime[]; // Lista de funciones disponibles para la película
    cityId?: string; // ID de la ciudad donde se proyecta la película (opcional)
}


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