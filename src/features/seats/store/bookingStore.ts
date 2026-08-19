import { create } from "zustand";

interface BookingState {
  movieId: string | null;
  showtimeId: string | null;
  seats: string[];
  setSelection: (payload: { movieId: string; showtimeId: string; seats: string[] }) => void;
  clear: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  movieId: null,
  showtimeId: null,
  seats: [],
  setSelection: ({ movieId, showtimeId, seats }) => set({ movieId, showtimeId, seats }),
  clear: () => set({ movieId: null, showtimeId: null, seats: [] }),
}));
