import { endpoints } from "@/services/endpoints";
import { request } from "@/services/http";
import { getShowtimeById, updateShowtime } from "@/services/showtimes";
import type { TicketPurchase } from "../types/checkout.types";

export async function completePurchase(ticket: TicketPurchase): Promise<void> {
  const showtime = await getShowtimeById(ticket.showtimeId);
  const unavailableSeats = ticket.seats.filter((seat) => showtime.occupiedSeats.includes(seat));

  if (showtime.isSoldOut || unavailableSeats.length > 0) {
    throw new Error("Uno o más asientos ya no están disponibles.");
  }

  const occupiedSeats = [...new Set([...showtime.occupiedSeats, ...ticket.seats])];
  await updateShowtime(showtime.id, {
    occupiedSeats,
  });
  await request<TicketPurchase>(endpoints.tickets, { method: "POST", data: ticket });
}
