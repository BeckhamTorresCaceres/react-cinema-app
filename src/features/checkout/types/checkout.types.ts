export interface TicketSnack {
  snackId: string;
  name: string;
  quantity: number;
  priceUnit: number;
}

export interface TicketPurchase {
  userId: string;
  showtimeId: string;
  seats: string[];
  snacks: TicketSnack[];
  totalAmount: number;
  purchaseDate: string;
  qrCode: string;
  status: "COMPLETED";
}
