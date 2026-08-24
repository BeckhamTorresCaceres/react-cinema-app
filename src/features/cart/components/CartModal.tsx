import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useCartStore } from "../store/cartStore";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatPrice = (price: number) => new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
}).format(price);

export const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const increaseSnackQuantity = useCartStore((state) => state.increaseSnackQuantity);
  const decreaseSnackQuantity = useCartStore((state) => state.decreaseSnackQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  if (!isOpen) return null;

  const subtotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const quantity = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="modal-overlay-enter fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={onClose}>
      <div className="modal-content-enter relative flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl border border-[#162E93]/50 bg-[#0A071E] shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#162E93]/30 p-6">
          <div className="flex items-center gap-3">
            <ShoppingCart size={22} className="text-[#8E8EFF]" />
            <div><h3 id="cart-title" className="text-xl font-bold text-white">Tu carrito</h3><p className="text-xs text-slate-400">{quantity} producto(s)</p></div>
          </div>
          <button type="button" onClick={onClose} className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-[#1A1953]/60 hover:text-white" aria-label="Cerrar carrito"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length > 0 ? (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 rounded-xl border border-[#162E93]/40 bg-[#1A1953]/40 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.kind === "ticket" ? `${item.cinemaName} · ${item.showtimeLabel} · Asientos: ${item.seats.join(", ")}` : item.description}</p>
                    <p className="mt-2 text-sm font-bold text-[#8E8EFF]">{formatPrice(item.unitPrice)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button type="button" onClick={() => removeItem(item.id)} className="cursor-pointer text-slate-500 transition hover:text-red-400" aria-label={`Eliminar ${item.name}`}><Trash2 size={16} /></button>
                    {item.kind === "snack" ? (
                      <div className="flex items-center gap-2 rounded-lg border border-[#162E93]/50 bg-[#141233] px-1.5 py-1">
                        <button type="button" onClick={() => decreaseSnackQuantity(item.id)} className="cursor-pointer rounded p-1 text-slate-300 hover:bg-[#162E93]/50" aria-label="Disminuir cantidad"><Minus size={14} /></button>
                        <span className="w-4 text-center text-sm font-semibold text-white">{item.quantity}</span>
                        <button type="button" onClick={() => increaseSnackQuantity(item.id)} className="cursor-pointer rounded p-1 text-slate-300 hover:bg-[#162E93]/50" aria-label="Aumentar cantidad"><Plus size={14} /></button>
                      </div>
                    ) : <span className="text-xs text-slate-400">{item.quantity} entrada(s)</span>}
                  </div>
                </li>
              ))}
            </ul>
          ) : <div className="flex flex-col items-center justify-center gap-3 py-16 text-center"><ShoppingCart size={40} className="text-slate-600" /><p className="text-sm text-slate-400">Tu carrito está vacío.</p></div>}
        </div>

        <div className="border-t border-[#162E93]/30 p-6">
          <div className="mb-4 flex items-center justify-between text-sm"><span className="text-slate-400">Subtotal</span><span className="text-lg font-extrabold text-white">{formatPrice(subtotal)}</span></div>
          <button type="button" onClick={() => { onClose(); navigate("/checkout"); }} disabled={items.length === 0} className="w-full cursor-pointer rounded-lg bg-[#2F2FE4] py-3 text-sm font-semibold text-white transition hover:bg-[#162E93] disabled:cursor-not-allowed disabled:opacity-40">Continuar con la compra</button>
        </div>
      </div>
    </div>
  );
};
