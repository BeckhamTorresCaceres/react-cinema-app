export interface SnackProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  hasPromo: boolean;
  promoLabel?: string;
  discountPercent?: number;
}

export interface CartItem {
  product: SnackProduct;
  quantity: number;
}

export interface TicketCartItem {
  id: string;
  movieId?: string;
  movieTitle: string;
  poster?: string;
  showtimeId: string;
  roomId?: string;
  ticketPrice: number;
  seats: string[];
  snacks: CartItem[];
  createdAt: string;
  expiresAt: number;
}

export type NewTicketCartItem = Omit<TicketCartItem, "id" | "createdAt" | "snacks" | "expiresAt">;

export const TICKET_RESERVATION_DURATION_MS = 5 * 60 * 1000;

export interface CartState {
  tickets: TicketCartItem[];
  activeTicketId: string | null;
  isConfiteriaModalOpen: boolean;
  addTicket: (ticket: NewTicketCartItem) => void;
  setActiveTicket: (ticketId: string | null) => void;
  addSnackToActiveTicket: (product: SnackProduct) => void;
  increaseSnack: (ticketId: string, productId: string) => void;
  decreaseSnack: (ticketId: string, productId: string) => void;
  removeSnack: (ticketId: string, productId: string) => void;
  removeTicket: (ticketId: string) => void;
  removeExpiredTickets: () => void;
  openConfiteriaModal: () => void;
  closeConfiteriaModal: () => void;
  clear: () => void;
  setUserScope: (userId: string | null) => void;
}

export interface ConfiteriaCategoriasProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export interface ConfiteriaCardProps {
  product: SnackProduct;
  onAdd?: (product: SnackProduct) => void;
}

export interface ConfiteriaBuscadorProps {
  value: string;
  onChange: (value: string) => void;
}
