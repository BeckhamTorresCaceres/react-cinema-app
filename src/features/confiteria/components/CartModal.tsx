import { useEffect, useState } from "react";
import { Clock3, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/features/auth/hooks/useAuthStore";
import { usePurchaseHistory } from "@/features/checkout/hooks/usePurchaseHistory";
import { useCartStore } from "../hooks/useCartStore";
import { formatPrice, ticketTotal } from "../utils/cartPricing";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CartTab = "carrito" | "historial";

const formatPurchaseDate = (isoDate: string) =>
  new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(isoDate));

const formatRemainingTime = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id);
  const [tab, setTab] = useState<CartTab>("carrito");
  const [now, setNow] = useState(() => Date.now());

  const tickets = useCartStore((state) => state.tickets);
  const activeTicketId = useCartStore((state) => state.activeTicketId);
  const setActiveTicket = useCartStore((state) => state.setActiveTicket);
  const openConfiteriaModal = useCartStore((state) => state.openConfiteriaModal);
  const increaseSnack = useCartStore((state) => state.increaseSnack);
  const decreaseSnack = useCartStore((state) => state.decreaseSnack);
  const removeSnack = useCartStore((state) => state.removeSnack);
  const removeTicket = useCartStore((state) => state.removeTicket);
  const total = tickets.reduce((sum, ticket) => sum + ticketTotal(ticket), 0);

  useEffect(() => {
    if (!isOpen || tab !== "carrito" || !tickets.length) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [isOpen, tab, tickets.length]);

  const { history, isLoading: isLoadingHistory, error: historyError } = usePurchaseHistory(
    isOpen && tab === "historial" ? userId : null,
  );

  if (!isOpen) return null;

  const selectSnacks = (ticketId: string) => {
    setActiveTicket(ticketId);
    onClose();
    openConfiteriaModal();
  };

  return (
    <div
      className="modal-overlay-enter fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      onClick={onClose}
    >
      <div
        className="modal-content-enter relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-[#162E93]/50 bg-[#0A071E] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#162E93]/30 p-6">
          <div className="flex items-center gap-3">
            <ShoppingCart size={22} className="text-[#8E8EFF]" />
            <div>
              <h3 id="cart-title" className="text-xl font-bold text-white">Tu carrito</h3>
              <p className="text-xs text-slate-400">{tickets.length} ticket(s) en construcción</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-[#1A1953]/60 hover:text-white" aria-label="Cerrar carrito">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-[#162E93]/30 px-6">
          <button
            type="button"
            onClick={() => setTab("carrito")}
            className={`border-b-2 px-1 py-3 text-sm font-semibold transition ${tab === "carrito" ? "border-[#2F2FE4] text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}
          >
            Carrito
          </button>
          <button
            type="button"
            onClick={() => setTab("historial")}
            className={`ml-6 border-b-2 px-1 py-3 text-sm font-semibold transition ${tab === "historial" ? "border-[#2F2FE4] text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}
          >
            Historial de compras
          </button>
        </div>

        {tab === "carrito" ? (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              {tickets.length ? (
                <ul className="space-y-4">
                  {tickets.map((ticket) => (
                    <li
                      key={ticket.id}
                      className={`rounded-xl border p-4 ${activeTicketId === ticket.id ? "border-[#8E8EFF]/70 bg-[#2F2FE4]/10" : "border-[#162E93]/40 bg-[#1A1953]/40"}`}
                    >
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{ticket.movieTitle}</p>
                          <p className="mt-1 text-xs text-slate-400">Asientos {ticket.seats.join(", ")}</p>
                        </div>
                        <button type="button" onClick={() => removeTicket(ticket.id)} className="text-slate-500 hover:text-red-400" aria-label={`Eliminar ${ticket.movieTitle}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className={`mt-3 flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold ${ticket.expiresAt - now <= 60_000 ? "bg-red-500/15 text-red-300" : "bg-[#2F2FE4]/15 text-[#B4B4FF]"}`}>
                        <span>Tiempo para completar la compra</span>
                        <span>{formatRemainingTime(ticket.expiresAt - now)}</span>
                      </div>
                      <button type="button" onClick={() => selectSnacks(ticket.id)} className="mt-3 text-xs font-semibold text-[#8E8EFF] hover:underline">
                        Agregar confitería a este ticket
                      </button>
                      {ticket.snacks.length > 0 && (
                        <ul className="mt-3 space-y-2 border-t border-[#162E93]/30 pt-3">
                          {ticket.snacks.map((item) => (
                            <li key={item.product.id} className="flex items-center justify-between gap-2 text-sm">
                              <span className="min-w-0 truncate text-slate-300">{item.product.name}</span>
                              <div className="flex items-center gap-2">
                                <button type="button" onClick={() => decreaseSnack(ticket.id, item.product.id)} aria-label="Disminuir"><Minus size={14} /></button>
                                <span>{item.quantity}</span>
                                <button type="button" onClick={() => increaseSnack(ticket.id, item.product.id)} aria-label="Aumentar"><Plus size={14} /></button>
                                <button type="button" onClick={() => removeSnack(ticket.id, item.product.id)} className="text-slate-500 hover:text-red-400" aria-label="Eliminar snack"><Trash2 size={14} /></button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="mt-4 text-right text-sm font-bold text-[#8E8EFF]">{formatPrice(ticketTotal(ticket))}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-16 text-center">
                  <ShoppingCart size={40} className="mx-auto text-slate-600" />
                  <p className="mt-3 text-sm text-slate-400">Tu carrito esta vacío.</p>
                </div>
              )}
            </div>
            <div className="border-t border-[#162E93]/30 p-6">
              <div className="mb-4 flex justify-between">
                <span className="text-slate-400">Total</span>
                <strong className="text-lg text-white">{formatPrice(total)}</strong>
              </div>
              <p className="mb-4 text-xs text-slate-500">Si el contador llega a cero, la reserva se cancelará automáticamente.</p>
              <button
                type="button"
                disabled={!tickets.length}
                onClick={() => { onClose(); navigate("/checkout"); }}
                className="w-full rounded-lg bg-[#2F2FE4] py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Revisar ticket
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            {isLoadingHistory ? (
              <p className="py-16 text-center text-sm text-slate-400">Cargando tu historial...</p>
            ) : historyError ? (
              <p className="py-16 text-center text-sm text-red-300">{historyError}</p>
            ) : history.length ? (
              <ul className="space-y-4">
                {history.map((ticket) => (
                  <li key={ticket.id} className="rounded-xl border border-[#162E93]/40 bg-[#1A1953]/30 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{ticket.movieTitle}</p>
                        <p className="mt-1 text-xs text-slate-400">Asientos {ticket.seats.join(", ")}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock3 size={12} />
                          {formatPurchaseDate(ticket.purchaseDate)}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                        Pagado
                      </span>
                    </div>
                    {ticket.snacks.length > 0 && (
                      <ul className="mt-3 space-y-1 border-t border-[#162E93]/30 pt-3 text-sm text-slate-300">
                        {ticket.snacks.map((snack) => (
                          <li key={snack.snackId} className="flex justify-between">
                            <span>{snack.quantity} × {snack.name}</span>
                            <span>{formatPrice(snack.priceUnit * snack.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-3 text-right text-sm font-bold text-[#8E8EFF]">{formatPrice(ticket.totalAmount)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-16 text-center">
                <Clock3 size={40} className="mx-auto text-slate-600" />
                <p className="mt-3 text-sm text-slate-400">Todavía no tienes compras registradas.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
