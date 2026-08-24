import type { SnackProduct } from "@/features/confiteria/types/confiteria.types";

interface CartItemBase {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface TicketCartItem extends CartItemBase {
  kind: "ticket";
  showtimeId: string;
  cinemaName: string;
  showtimeLabel: string;
  seats: string[];
}

export interface SnackCartItem extends CartItemBase {
  kind: "snack";
  description: string;
}

export type CartItem = TicketCartItem | SnackCartItem;

export interface AddTicketInput {
  movieTitle: string;
  showtimeId: string;
  cinemaName: string;
  showtimeLabel: string;
  seats: string[];
  unitPrice: number;
}

export type { SnackProduct };
