import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useCartStore, type TicketCartItem } from "@/features/confiteria/store/cartStore";
import type { SnackProduct } from "@/features/confiteria/types/confiteria.types";

interface CartModalProps { isOpen: boolean; onClose: () => void; }
const unitPrice = (product: SnackProduct) => product.hasPromo && product.discountPercent ? product.price * (1 - product.discountPercent / 100) : product.price;
const formatPrice = (value: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
const ticketTotal = (ticket: TicketCartItem) => ticket.ticketPrice * ticket.seats.length + ticket.snacks.reduce((total, item) => total + unitPrice(item.product) * item.quantity, 0);

export const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const navigate = useNavigate();
  const tickets = useCartStore((state) => state.tickets);
  const activeTicketId = useCartStore((state) => state.activeTicketId);
  const setActiveTicket = useCartStore((state) => state.setActiveTicket);
  const increaseSnack = useCartStore((state) => state.increaseSnack);
  const decreaseSnack = useCartStore((state) => state.decreaseSnack);
  const removeSnack = useCartStore((state) => state.removeSnack);
  const removeTicket = useCartStore((state) => state.removeTicket);
  const total = tickets.reduce((sum, ticket) => sum + ticketTotal(ticket), 0);

  if (!isOpen) return null;
  const selectSnacks = (ticketId: string) => { setActiveTicket(ticketId); onClose(); navigate("/confiteria"); };

  return <div className="modal-overlay-enter fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={onClose}>
    <div className="modal-content-enter relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-[#162E93]/50 bg-[#0A071E] shadow-2xl" onClick={(event) => event.stopPropagation()}>
      <div className="flex items-center justify-between border-b border-[#162E93]/30 p-6"><div className="flex items-center gap-3"><ShoppingCart size={22} className="text-[#8E8EFF]" /><div><h3 id="cart-title" className="text-xl font-bold text-white">Tu carrito</h3><p className="text-xs text-slate-400">{tickets.length} ticket(s)</p></div></div><button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-[#1A1953]/60 hover:text-white" aria-label="Cerrar carrito"><X size={20} /></button></div>
      <div className="flex-1 overflow-y-auto p-6">{tickets.length ? <ul className="space-y-4">{tickets.map((ticket) => <li key={ticket.id} className={`rounded-xl border p-4 ${activeTicketId === ticket.id ? "border-[#8E8EFF]/70 bg-[#2F2FE4]/10" : "border-[#162E93]/40 bg-[#1A1953]/40"}`}><div className="flex justify-between gap-3"><div><p className="font-semibold text-white">{ticket.movieTitle}</p><p className="mt-1 text-xs text-slate-400">Asientos {ticket.seats.join(", ")}</p></div><button type="button" onClick={() => removeTicket(ticket.id)} className="text-slate-500 hover:text-red-400" aria-label={`Eliminar ${ticket.movieTitle}`}><Trash2 size={16} /></button></div><button type="button" onClick={() => selectSnacks(ticket.id)} className="mt-3 text-xs font-semibold text-[#8E8EFF] hover:underline">Agregar confitería a este ticket</button>{ticket.snacks.length > 0 && <ul className="mt-3 space-y-2 border-t border-[#162E93]/30 pt-3">{ticket.snacks.map((item) => <li key={item.product.id} className="flex items-center justify-between gap-2 text-sm"><span className="min-w-0 truncate text-slate-300">{item.product.name}</span><div className="flex items-center gap-2"><button type="button" onClick={() => decreaseSnack(ticket.id, item.product.id)} aria-label="Disminuir"><Minus size={14} /></button><span>{item.quantity}</span><button type="button" onClick={() => increaseSnack(ticket.id, item.product.id)} aria-label="Aumentar"><Plus size={14} /></button><button type="button" onClick={() => removeSnack(ticket.id, item.product.id)} className="text-slate-500 hover:text-red-400" aria-label="Eliminar snack"><Trash2 size={14} /></button></div></li>)}</ul>}<p className="mt-4 text-right text-sm font-bold text-[#8E8EFF]">{formatPrice(ticketTotal(ticket))}</p></li>)}</ul> : <div className="py-16 text-center"><ShoppingCart size={40} className="mx-auto text-slate-600" /><p className="mt-3 text-sm text-slate-400">Tu carrito esta vacío.</p></div>}</div>
      <div className="border-t border-[#162E93]/30 p-6"><div className="mb-4 flex justify-between"><span className="text-slate-400">Total</span><strong className="text-lg text-white">{formatPrice(total)}</strong></div><button type="button" disabled={!tickets.length} onClick={() => { onClose(); navigate("/checkout"); }} className="w-full rounded-lg bg-[#2F2FE4] py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Pagar compra</button></div>
    </div>
  </div>;
};
