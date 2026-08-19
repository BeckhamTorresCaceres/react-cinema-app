export type SeatStatus = "available" | "occupied" | "selected" | "vip";

export interface SeatOccupancy {
  id: string;
  occupied: string[];
}

export interface SeatCell {
  id: string;
  row: string;
  number: number;
  isAisle: boolean;
}
