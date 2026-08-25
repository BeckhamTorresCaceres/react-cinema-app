import type { Room } from "@/features/seats/types/seats.types";
import { endpoints } from "./endpoints";
import { request } from "./http";

export async function getRoomById(roomId: string): Promise<Room> {
  try {
    return await request<Room>(endpoints.roomById(roomId));
  } catch {
    throw new Error("No fue posible cargar la sala.");
  }
}
