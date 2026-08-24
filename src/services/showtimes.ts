import type { Showtime } from "@/features/billboard/types/billboard.types";
import { endpoints } from "./endpoints";
import { request } from "./http";

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


export async function createShowtime(showtime: Record<string, unknown>): Promise<Showtime> {
  return request<Showtime>(endpoints.showtimes, {
    method: "POST",
    data: showtime,
  });
}

export async function updateShowtime(id: string, showtime: Record<string, unknown>): Promise<Showtime> {
  return request<Showtime>(endpoints.showtimeById(id), {
    method: "PUT",
    data: showtime,
  });
}

export async function deleteShowtime(id: string): Promise<void> {
  await request<void>(endpoints.showtimeById(id), {
    method: "DELETE",
  });
}