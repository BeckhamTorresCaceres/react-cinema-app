import type { Showtime } from "@/features/billboard/types/billboard.types";
import { endpoints } from "@/services/endpoints";
import { request } from "@/services/http";

export async function getShowtimes(): Promise<Showtime[]> {
  try {
    return await request<Showtime[]>(endpoints.showtimes);
  } catch {
    throw new Error("No fue posible cargar las funciones.");
  }
}

export async function getShowtimeById(showtimeId: string): Promise<Showtime> {
  try {
    return await request<Showtime>(endpoints.showtimeById(showtimeId));
  } catch {
    throw new Error("No fue posible cargar la función.");
  }
}

export async function updateShowtime(id: string, updates: Partial<Showtime>): Promise<Showtime> {
  return request<Showtime>(endpoints.showtimeById(id), {
    method: "PATCH",
    data: updates,
  });
}
