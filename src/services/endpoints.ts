export const endpoints = {
  users: "/users",
  movies: "/movies",
  locations: "/location",
  showtimes: "/showtimes",
  seatsByShowtime: (showtimeId: string) => `/seats/${showtimeId}`,
  userWithRoles: "/users?_expand=role",
  userById: (id: string | number) => `/users/${id}`,
  usersByEmail: (email: string) => `/users?email=${encodeURIComponent(email)}`,
} as const;
