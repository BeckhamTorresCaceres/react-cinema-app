import type { Showtime } from "@/features/billboard/types/billboard.types";
import type { SeatSelectionData } from "../types/seats.types";
import { getRoomById } from "@/features/seats/services/roomService";

export async function getSeatSelectionData(showtime: Showtime): Promise<SeatSelectionData> {
  try {
    const room = await getRoomById(showtime.roomId);

    return { room, occupiedSeats: showtime.occupiedSeats };
  } catch {
    throw new Error("No fue posible cargar los asientos.");
  }
}
