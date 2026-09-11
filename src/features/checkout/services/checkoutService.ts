import { endpoints } from "@/services/endpoints";
import { request } from "@/services/http";
import { getMovieById, getShowtimeById, updateShowtime } from "@/features/billboard/services/billboardService";
import type { PurchaseHistoryItem, PurchasedTicket, TicketPurchase } from "../types/checkout.types";

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

/** Historial de compras ya pagadas de un usuario, con título y póster de la película. */
export async function getPurchaseHistory(userId: string): Promise<PurchaseHistoryItem[]> {
  const tickets = await request<PurchasedTicket[]>(endpoints.ticketsByUser(userId));

  const history = await Promise.all(
    tickets.map(async (ticket) => {
      try {
        const showtime = await getShowtimeById(ticket.showtimeId);
        const movie = await getMovieById(showtime.movieId);
        return { ...ticket, movieTitle: movie.title, poster: movie.poster };
      } catch {
        return { ...ticket, movieTitle: "Película no disponible", poster: "" };
      }
    }),
  );

  return history.sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate));
}
