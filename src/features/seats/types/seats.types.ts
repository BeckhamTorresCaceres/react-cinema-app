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

export interface SeatSelectionData {
  room: Room;
  occupiedSeats: string[];
}

export interface SeatMapProps {
  layout: Seat[][];
  occupied: string[];
  selected: string[];
  onToggle: (seatId: string) => void;
  disabled?: boolean;
}
