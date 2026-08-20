import type { SeatOccupancy } from "@/features/seats/types/seats.types";
import { endpoints } from "./endpoints";
import { requestAllowNotFound } from "./http";

export async function getOccupiedSeats(showtimeId: string): Promise<string[]> {
  const data = await requestAllowNotFound<SeatOccupancy | null>(
    endpoints.seatsByShowtime(showtimeId),
    null,
  );

  return data?.occupied ?? [];
}
