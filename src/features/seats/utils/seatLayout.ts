import type { Seat } from "../types/seats.types";

export const MAX_SELECTED_SEATS = 8;

export function buildSeatLayout(seats: Seat[]): Seat[][] {
  const rows = new Map<string, Seat[]>();

  seats.forEach((seat) => {
    const row = rows.get(seat.row) ?? [];
    row.push(seat);
    rows.set(seat.row, row);
  });

  return [...rows.entries()]
    .sort(([firstRow], [secondRow]) => firstRow.localeCompare(secondRow, undefined, { numeric: true }))
    .map(([, row]) => row.sort((firstSeat, secondSeat) => firstSeat.number - secondSeat.number));
}
