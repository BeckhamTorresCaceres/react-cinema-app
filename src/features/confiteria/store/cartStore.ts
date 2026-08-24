// Guardar los productos de confitería que el cliente agrega, edita o cancela en su carrito de compra
import { create } from "zustand";
import type { CartItem, SnackProduct } from "../types/confiteria.types";

interface CartState {
  items: CartItem[];
  addToCart: (product: SnackProduct) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],

  addToCart: (product) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.product.id === product.id);

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        };
      }

      return { items: [...state.items, { product, quantity: 1 }] };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((item) => item.product.id !== productId)
          : state.items.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    })),

  removeFromCart: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),

  clearCart: () => set({ items: [] }),
}));
