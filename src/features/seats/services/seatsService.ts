import { API_URL } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { SeatOccupancy } from "../types/seats.types";

export async function getSeatOccupancy(showtimeId: string): Promise<string[]> {
  const response = await fetch(`${API_URL}${endpoints.seatsByShowtime(showtimeId)}`);

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error("No fue posible cargar los asientos.");
  }

  const data = (await response.json()) as SeatOccupancy;
  return data.occupied ?? [];
}
