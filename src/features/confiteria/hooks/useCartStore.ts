import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TICKET_RESERVATION_DURATION_MS, type CartState, type NewTicketCartItem, type SnackProduct, type TicketCartItem } from "../types/confiteria.types";


const updateTicket = (
  tickets: TicketCartItem[],
  ticketId: string,
  update: (ticket: TicketCartItem) => TicketCartItem,
): TicketCartItem[] => tickets.map((ticket) => (ticket.id === ticketId ? update(ticket) : ticket));

export const useCartStore = create<CartState>()(persist((set) => ({
  tickets: [],
  activeTicketId: null,
  isConfiteriaModalOpen: false,
  addTicket: (ticket: NewTicketCartItem) => set((state) => {
    const id = `${ticket.showtimeId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newTicket: TicketCartItem = {
      ...ticket,
      id,
      snacks: [],
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + TICKET_RESERVATION_DURATION_MS,
    };
    return { tickets: [...state.tickets, newTicket], activeTicketId: id };
  }),
  setActiveTicket: (activeTicketId) => set({ activeTicketId }),
  addSnackToActiveTicket: (product: SnackProduct) => set((state) => {
    if (!state.activeTicketId) return state;
    return {
      tickets: updateTicket(state.tickets, state.activeTicketId, (ticket) => {
        const existing = ticket.snacks.find((item) => item.product.id === product.id);
        const snacks = existing
          ? ticket.snacks.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
          : [...ticket.snacks, { product, quantity: 1 }];
        return { ...ticket, snacks };
      }),
    };
  }),
  increaseSnack: (ticketId, productId) => set((state) => ({
    tickets: updateTicket(state.tickets, ticketId, (ticket) => ({
      ...ticket,
      snacks: ticket.snacks.map((item) => item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item),
    })),
  })),
  decreaseSnack: (ticketId, productId) => set((state) => ({
    tickets: updateTicket(state.tickets, ticketId, (ticket) => ({
      ...ticket,
      snacks: ticket.snacks.flatMap((item) =>
        item.product.id !== productId ? [item] : item.quantity === 1 ? [] : [{ ...item, quantity: item.quantity - 1 }]
      ),
    })),
  })),
  removeSnack: (ticketId, productId) => set((state) => ({
    tickets: updateTicket(state.tickets, ticketId, (ticket) => ({
      ...ticket,
      snacks: ticket.snacks.filter((item) => item.product.id !== productId),
    })),
  })),
  removeTicket: (ticketId) => set((state) => {
    const tickets = state.tickets.filter((ticket) => ticket.id !== ticketId);
    return {
      tickets,
      activeTicketId: state.activeTicketId === ticketId ? tickets.at(-1)?.id ?? null : state.activeTicketId,
    };
  }),
  removeExpiredTickets: () => set((state) => {
    const tickets = state.tickets.filter((ticket) => ticket.expiresAt > Date.now());
    if (tickets.length === state.tickets.length) return state;

    return {
      tickets,
      activeTicketId: tickets.some((ticket) => ticket.id === state.activeTicketId)
        ? state.activeTicketId
        : tickets.at(-1)?.id ?? null,
    };
  }),
  clear: () => set({ tickets: [], activeTicketId: null }),
  openConfiteriaModal: () => set({ isConfiteriaModalOpen: true }),
  closeConfiteriaModal: () => set({ isConfiteriaModalOpen: false }),
}), {
  name: "lumi-cart",
  version: 3,
  migrate: (persistedState) => {
    const state = persistedState as CartState;
    return {
      ...state,
      tickets: state.tickets.map((ticket) => ({
        ...ticket,
        expiresAt: ticket.expiresAt ?? new Date(ticket.createdAt).getTime() + TICKET_RESERVATION_DURATION_MS,
      })),
    };
  },
  partialize: (state) => ({ tickets: state.tickets, activeTicketId: state.activeTicketId }),
}));
