import { useState } from "react";
import { CheckCircle2, CreditCard } from "lucide-react";
import { Link } from "react-router";
import { useAuthStore } from "@/features/auth/hooks/useAuthStore";
import { useCartStore } from "@/features/confiteria/hooks/useCartStore";
import { formatPrice, ticketTotal, unitPrice } from "@/features/confiteria/utils/cartPricing";
import { completePurchase } from "../services/checkoutService";

export const CheckoutPage = () => {
  const user = useAuthStore((state) => state.user);
  const tickets = useCartStore((state) => state.tickets);
  const clearCart = useCartStore((state) => state.clear);
  const removeExpiredTickets = useCartStore((state) => state.removeExpiredTickets);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const total = tickets.reduce((sum, ticket) => sum + ticketTotal(ticket), 0);

  if (!tickets.length) return <main className="mx-auto max-w-xl px-4 py-16 text-center text-white"><h1 className="text-3xl font-bold">Tu carrito no tiene tickets</h1><p className="mt-3 text-slate-400">Selecciona una función y sus asientos para comenzar.</p><Link to="/#cartelera" className="mt-6 inline-block rounded-lg bg-[#2F2FE4] px-5 py-3 font-semibold">Ver cartelera</Link></main>;

  const pay = async () => {
    if (!user?.id) return;
    setIsPaying(true);
    setError(null);
    try {
      for (const ticket of tickets) {
        if (ticket.expiresAt <= Date.now()) {
          removeExpiredTickets();
          throw new Error("El tiempo de reserva terminó. Selecciona nuevamente tus asientos.");
        }
        const purchaseDate = new Date().toISOString();
        await completePurchase({ userId: user.id, showtimeId: ticket.showtimeId, seats: ticket.seats, snacks: ticket.snacks.map((item) => ({ snackId: item.product.id, name: item.product.name, quantity: item.quantity, priceUnit: unitPrice(item.product) })), totalAmount: ticketTotal(ticket), purchaseDate, qrCode: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(`${ticket.showtimeId}-${ticket.seats.join("-")}-${purchaseDate}`)}`, status: "COMPLETED" });
      }
      clearCart();
      setIsComplete(true);
    } catch (purchaseError) {
      setError(purchaseError instanceof Error ? purchaseError.message : "No fue posible completar el pago.");
    } finally { setIsPaying(false); }
  };

  if (isComplete) return <main className="mx-auto max-w-xl px-4 py-16 text-center text-white"><CheckCircle2 size={56} className="mx-auto text-emerald-400" /><h1 className="mt-5 text-3xl font-bold">Compra confirmada</h1><p className="mt-3 text-slate-400">Se registraron {tickets.length} ticket(s) correctamente.</p><Link to="/" className="mt-6 inline-block rounded-lg bg-[#2F2FE4] px-5 py-3 font-semibold">Volver al inicio</Link></main>;

  return <main className="mx-auto max-w-3xl px-4 py-10 text-white sm:py-16"><div className="rounded-3xl border border-[#162E93]/40 bg-[#1A1953]/30 p-6 sm:p-8"><div className="flex items-center gap-3"><CreditCard className="text-[#8E8EFF]" /><div><h1 className="text-2xl font-bold">Confirmar pago</h1><p className="text-sm text-slate-400">Vas a comprar {tickets.length} ticket(s).</p></div></div><div className="mt-8 space-y-4">{tickets.map((ticket) => <section key={ticket.id} className="rounded-xl border border-[#162E93]/40 bg-[#080616]/30 p-4"><div className="flex justify-between gap-4"><div><h2 className="font-semibold">{ticket.movieTitle}</h2><p className="mt-1 text-sm text-slate-400">Asientos: {ticket.seats.join(", ")}</p></div><strong>{formatPrice(ticket.ticketPrice * ticket.seats.length)}</strong></div>{ticket.snacks.length > 0 && <ul className="mt-3 border-t border-[#162E93]/30 pt-3 text-sm text-slate-300">{ticket.snacks.map((item) => <li key={item.product.id} className="flex justify-between"><span>{item.quantity} × {item.product.name}</span><span>{formatPrice(unitPrice(item.product) * item.quantity)}</span></li>)}</ul>}<p className="mt-3 text-right font-bold text-[#8E8EFF]">{formatPrice(ticketTotal(ticket))}</p></section>)}</div><div className="mt-8 flex justify-between border-t border-[#162E93]/40 pt-5"><span className="text-slate-400">Total</span><strong className="text-2xl">{formatPrice(total)}</strong></div>{error && <p className="mt-4 rounded-lg border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}<button type="button" onClick={() => void pay()} disabled={isPaying} className="mt-6 w-full rounded-xl bg-[#2F2FE4] py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{isPaying ? "Procesando..." : `Pagar ${formatPrice(total)}`}</button></div></main>;
};
