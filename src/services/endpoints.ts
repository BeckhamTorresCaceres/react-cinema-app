export const endpoints = {
  users: "/users",
  movies: "/movies",
  locations: "/location",
  userWithRoles: "/users?_expand=role",
  userById: (id: string | number) => `/users/${id}`,
  usersByEmail: (email: string) => `/users?email=${encodeURIComponent(email)}`,
} as const;
