export type SeatType = "standard" | "preferential";

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: SeatType;
}

export interface Room {
  id: string;
  cinemaId: string;
  nombre: string;
  tipoFormatos: string[];
  capacity: number;
  seatsLayout: Seat[];
}
