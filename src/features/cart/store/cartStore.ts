import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AddTicketInput, CartItem, SnackProduct } from "../types/cart.types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addTicket: (input: AddTicketInput) => void;
  addSnack: (product: SnackProduct) => void;
  increaseSnackQuantity: (id: string) => void;
  decreaseSnackQuantity: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addTicket: ({ movieTitle, showtimeId, cinemaName, showtimeLabel, seats, unitPrice }) => set((state) => {
        const sortedSeats = [...seats].sort((first, second) => first.localeCompare(second, undefined, { numeric: true }));
        const id = `ticket-${showtimeId}-${sortedSeats.join("-")}`;

        if (state.items.some((item) => item.id === id)) return { isOpen: true };

        return {
          items: [...state.items, {
            id,
            kind: "ticket",
            name: movieTitle,
            showtimeId,
            cinemaName,
            showtimeLabel,
            seats: sortedSeats,
            unitPrice,
            quantity: sortedSeats.length,
          }],
          isOpen: true,
        };
      }),
      addSnack: (product) => set((state) => {
        const id = `snack-${product.id}`;
        const exists = state.items.some((item) => item.id === id);

        return {
          items: exists
            ? state.items.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
            : [...state.items, { id, kind: "snack", name: product.name, description: product.description, unitPrice: product.price, quantity: 1 }],
        };
      }),
      increaseSnackQuantity: (id) => set((state) => ({
        items: state.items.map((item) => item.id === id && item.kind === "snack" ? { ...item, quantity: item.quantity + 1 } : item),
      })),
      decreaseSnackQuantity: (id) => set((state) => ({
        items: state.items.flatMap((item) => {
          if (item.id !== id || item.kind !== "snack") return [item];
          return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [];
        }),
      })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "lumi-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
