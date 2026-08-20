import { getOccupiedSeats } from "@/services/seats";

export async function getSeatOccupancy(showtimeId: string): Promise<string[]> {
  try {
    return await getOccupiedSeats(showtimeId);
  } catch {
    throw new Error("No fue posible cargar los asientos.");
  }
}
