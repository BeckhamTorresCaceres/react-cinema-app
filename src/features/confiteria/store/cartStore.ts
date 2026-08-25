import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, SnackProduct } from "../types/confiteria.types";

export interface TicketCartItem {
  id: string;
  movieId: string;
  movieTitle: string;
  poster: string;
  showtimeId: string;
  roomId: string;
  ticketPrice: number;
  seats: string[];
  snacks: CartItem[];
}

type NewTicketCartItem = Omit<TicketCartItem, "id" | "snacks">;

interface CartState {
  tickets: TicketCartItem[];
  activeTicketId: string | null;
  addTicket: (ticket: NewTicketCartItem) => void;
  setActiveTicket: (ticketId: string) => void;
  addSnackToActiveTicket: (product: SnackProduct) => void;
  increaseSnack: (ticketId: string, productId: string) => void;
  decreaseSnack: (ticketId: string, productId: string) => void;
  removeSnack: (ticketId: string, productId: string) => void;
  removeTicket: (ticketId: string) => void;
  clear: () => void;
}

const updateTicket = (tickets: TicketCartItem[], ticketId: string, update: (ticket: TicketCartItem) => TicketCartItem) => (
  tickets.map((ticket) => ticket.id === ticketId ? update(ticket) : ticket)
);

export const useCartStore = create<CartState>()(persist((set) => ({
  tickets: [],
  activeTicketId: null,
  addTicket: (ticket) => set((state) => {
    const id = `${ticket.showtimeId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    return { tickets: [...state.tickets, { ...ticket, id, snacks: [] }], activeTicketId: id };
  }),
  setActiveTicket: (activeTicketId) => set({ activeTicketId }),
  addSnackToActiveTicket: (product) => set((state) => {
    if (!state.activeTicketId) return state;
    return { tickets: updateTicket(state.tickets, state.activeTicketId, (ticket) => {
      const existing = ticket.snacks.find((item) => item.product.id === product.id);
      const snacks = existing
        ? ticket.snacks.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...ticket.snacks, { product, quantity: 1 }];
      return { ...ticket, snacks };
    }) };
  }),
  increaseSnack: (ticketId, productId) => set((state) => ({ tickets: updateTicket(state.tickets, ticketId, (ticket) => ({ ...ticket, snacks: ticket.snacks.map((item) => item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item) })) })),
  decreaseSnack: (ticketId, productId) => set((state) => ({ tickets: updateTicket(state.tickets, ticketId, (ticket) => ({ ...ticket, snacks: ticket.snacks.flatMap((item) => item.product.id !== productId ? [item] : item.quantity === 1 ? [] : [{ ...item, quantity: item.quantity - 1 }]) })) })),
  removeSnack: (ticketId, productId) => set((state) => ({ tickets: updateTicket(state.tickets, ticketId, (ticket) => ({ ...ticket, snacks: ticket.snacks.filter((item) => item.product.id !== productId) })) })),
  removeTicket: (ticketId) => set((state) => {
    const tickets = state.tickets.filter((ticket) => ticket.id !== ticketId);
    return { tickets, activeTicketId: state.activeTicketId === ticketId ? tickets.at(-1)?.id ?? null : state.activeTicketId };
  }),
  clear: () => set({ tickets: [], activeTicketId: null }),
}), { name: "lumi-cart", version: 2 }));
