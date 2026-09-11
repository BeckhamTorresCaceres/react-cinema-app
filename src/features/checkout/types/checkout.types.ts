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

/** Ticket ya persistido en el servidor (incluye el id asignado). */
export interface PurchasedTicket extends TicketPurchase {
  id: string;
}

/** Ticket comprado, enriquecido con datos de la película/función para mostrar en el historial. */
export interface PurchaseHistoryItem extends PurchasedTicket {
  movieTitle: string;
  poster: string;
}
