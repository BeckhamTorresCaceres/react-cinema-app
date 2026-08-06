import type { Movie } from "@/features/billboard/types/billboard.types";

export const MOCK_MOVIES: Movie[] = [
  {
    id: "1",
    title: "Inception",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
    genre: "Ciencia Ficción",
    rating: "PG-13",
    duration: 148,
    director: "Christopher Nolan",
    languages: ["Español", "Inglés", "Subtitulada"],
    formats: ["2D", "IMAX"],
    score: 8.8,
    isReleased: true,
    isActive: true,
    showtimes: [
      { id: "s1", time: "14:00", format: "IMAX", language: "Subtitulada", isSoldOut: false },
      { id: "s2", time: "17:30", format: "IMAX", language: "Subtitulada", isSoldOut: true },
      { id: "s3", time: "20:45", format: "2D", language: "Español", isSoldOut: false },
    ],
  },
  {
    id: "2",
    title: "The Dark Knight",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800",
    genre: "Acción",
    rating: "PG-13",
    duration: 152,
    director: "Christopher Nolan",
    languages: ["Español", "Inglés"],
    formats: ["2D", "3D"],
    score: 9.0,
    isReleased: false,
    isActive: true,
    showtimes: [
      { id: "s4", time: "15:15", format: "3D", language: "Español", isSoldOut: false },
      { id: "s5", time: "19:00", format: "2D", language: "Español", isSoldOut: false },
    ],
  },
];