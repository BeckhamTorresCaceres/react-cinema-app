import type { CartItem } from "@/features/cart/types/cart.types";

export interface CreateOrderInput {
  userId: string;
  items: CartItem[];
}

export interface Order {
  id: string;
  userId: string;
  status: "confirmed";
  paymentStatus: "mock_paid";
  confirmationCode: string;
  createdAt: string;
  total: number;
  items: CartItem[];
}
