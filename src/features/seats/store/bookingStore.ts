import { create } from "zustand";

interface BookingState {
  movieId: string | null;
  showtimeId: string | null;
  roomId: string | null;
  ticketPrice: number | null;
  seats: string[];
  setSelection: (payload: { movieId: string; showtimeId: string; roomId: string; ticketPrice: number; seats: string[] }) => void;
  clear: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  movieId: null,
  showtimeId: null,
  roomId: null,
  ticketPrice: null,
  seats: [],
  setSelection: ({ movieId, showtimeId, roomId, ticketPrice, seats }) => set({ movieId, showtimeId, roomId, ticketPrice, seats }),
  clear: () => set({ movieId: null, showtimeId: null, roomId: null, ticketPrice: null, seats: [] }),
}));
