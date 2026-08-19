import type { SeatCell } from "../types/seats.types";

export const SEAT_ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
export const SEATS_PER_ROW = 12;
export const AISLE_AFTER = 6;
export const VIP_ROWS = new Set(["G", "H"]);
export const MAX_SELECTED_SEATS = 8;
export const TICKET_PRICE = 18000;

export function seatId(row: string, number: number): string {
  return `${row}${number}`;
}

export function buildSeatLayout(): SeatCell[][] {
  return SEAT_ROWS.map((row) => {
    const cells: SeatCell[] = [];

    for (let number = 1; number <= SEATS_PER_ROW; number += 1) {
      if (number === AISLE_AFTER + 1) {
        cells.push({ id: `${row}-aisle`, row, number: 0, isAisle: true });
      }

      cells.push({
        id: seatId(row, number),
        row,
        number,
        isAisle: false,
      });
    }

    return cells;
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}
