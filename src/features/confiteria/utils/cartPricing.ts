import type { CartItem, SnackProduct, TicketCartItem } from "../types/confiteria.types";

/** Formatea un valor como moneda colombiana (COP), sin decimales. */
export const formatPrice = (value: number): string =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);

/** Precio unitario de un producto, aplicando su descuento de promo si tiene. */
export const unitPrice = (product: SnackProduct): number =>
  product.hasPromo && product.discountPercent
    ? product.price * (1 - product.discountPercent / 100)
    : product.price;

/** Total de un ticket: boletos (precio x asientos) + snacks agregados. */
export const ticketTotal = (ticket: TicketCartItem): number =>
  ticket.ticketPrice * ticket.seats.length +
  ticket.snacks.reduce((total: number, item: CartItem) => total + unitPrice(item.product) * item.quantity, 0);
