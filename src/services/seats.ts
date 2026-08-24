import type { SeatOccupancy } from "@/features/seats/types/seats.types";
import { endpoints } from "./endpoints";
import { request, requestAllowNotFound } from "./http";

export async function getOccupiedSeats(showtimeId: string): Promise<string[]> {
  const data = await requestAllowNotFound<SeatOccupancy | null>(
    endpoints.seatsByShowtime(showtimeId),
    null,
  );

  return data?.occupied ?? [];
}

export async function reserveSeats(showtimeId: string, seats: string[]): Promise<void> {
  const current = await requestAllowNotFound<SeatOccupancy | null>(endpoints.seatsByShowtime(showtimeId), null);
  const occupied = [...new Set([...(current?.occupied ?? []), ...seats])];

  if (current) {
    await request<SeatOccupancy>(endpoints.seatsByShowtime(showtimeId), { method: "PATCH", data: { occupied } });
    return;
  }

  await request<SeatOccupancy>(endpoints.seats, { method: "POST", data: { id: showtimeId, occupied } });
}
