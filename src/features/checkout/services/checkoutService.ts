import { getOccupiedSeats, reserveSeats } from "@/services/seats";
import { endpoints } from "@/services/endpoints";
import { request } from "@/services/http";
import type { CreateOrderInput, Order } from "../types/checkout.types";

const confirmationCode = () => `LUMI-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

export async function createOrder({ userId, items }: CreateOrderInput): Promise<Order> {
  if (!userId || items.length === 0) throw new Error("No hay productos para comprar.");

  const tickets = items.filter((item) => item.kind === "ticket");
  const seatsByShowtime = new Map<string, string[]>();

  for (const ticket of tickets) {
    const current = seatsByShowtime.get(ticket.showtimeId) ?? [];
    seatsByShowtime.set(ticket.showtimeId, [...current, ...ticket.seats]);
  }

  for (const [showtimeId, seats] of seatsByShowtime) {
    if (new Set(seats).size !== seats.length) throw new Error("Un asiento solo puede estar una vez en el carrito.");
    const occupied = await getOccupiedSeats(showtimeId);
    const unavailable = seats.filter((seat) => occupied.includes(seat));
    if (unavailable.length > 0) throw new Error(`Los asientos ${unavailable.join(", ")} ya no están disponibles.`);
  }

  for (const [showtimeId, seats] of seatsByShowtime) await reserveSeats(showtimeId, seats);

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return request<Order>(endpoints.orders, {
    method: "POST",
    data: {
      userId,
      status: "confirmed",
      paymentStatus: "mock_paid",
      confirmationCode: confirmationCode(),
      createdAt: new Date().toISOString(),
      total,
      items,
    },
  });
}
