export const endpoints = {
  users: "/users",
  movies: "/movies",
  locations: "/location",
  showtimes: "/showtimes",
  seatsByShowtime: (showtimeId: string) => `/seats/${showtimeId}`,
  movieById: (id: string | number) => `/movies/${id}`,
  showtimeById: (id: string | number) => `/showtimes/${id}`,
  userWithRoles: "/users?_expand=role",
  userById: (id: string | number) => `/users/${id}`,
  usersByEmail: (email: string) => `/users?email=${encodeURIComponent(email)}`,
} as const;
