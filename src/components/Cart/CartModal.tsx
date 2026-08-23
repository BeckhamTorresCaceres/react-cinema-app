import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * TODO (próxima iteración):
 * - Reemplazar `mockCartItems` por el estado real del carrito (store de Zustand,
 *   igual que `useAuthStore` o `bookingStore`).
 * - Conectar `onIncrease` / `onDecrease` / `onRemove` a las acciones del store.
 * - Calcular `subtotal` a partir de los items reales.
 * Por ahora este componente SOLO representa el diseño del modal.
 */
const mockCartItems: {
  id: string;
  name: string;
  detail: string;
  price: number;
  quantity: number;
}[] = [];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

export const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  if (!isOpen) return null;

  const subtotal = mockCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <div
      className="modal-overlay-enter fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl border border-[#162E93]/50 bg-[#0A071E] shadow-2xl modal-content-enter"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#162E93]/30 p-6">
          <div className="flex items-center gap-3">
            <ShoppingCart size={22} className="text-[#8E8EFF]" />
            <div>
              <h3 id="cart-title" className="text-xl font-bold text-white">
                Tu carrito
              </h3>
              <p className="text-xs text-slate-400">
                {mockCartItems.length} producto(s)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-[#1A1953]/60 hover:text-white"
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lista de items */}
        <div className="flex-1 overflow-y-auto p-6">
          {mockCartItems.length > 0 ? (
            <ul className="space-y-4">
              {mockCartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-[#162E93]/40 bg-[#1A1953]/40 p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
                    <p className="mt-2 text-sm font-bold text-[#8E8EFF]">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      className="cursor-pointer text-slate-500 transition hover:text-red-400"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center gap-2 rounded-lg border border-[#162E93]/50 bg-[#141233] px-1.5 py-1">
                      <button
                        type="button"
                        className="cursor-pointer rounded p-1 text-slate-300 hover:bg-[#162E93]/50"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-4 text-center text-sm font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="cursor-pointer rounded p-1 text-slate-300 hover:bg-[#162E93]/50"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <ShoppingCart size={40} className="text-slate-600" />
              <p className="text-sm text-slate-400">Tu carrito está vacío.</p>
            </div>
          )}
        </div>

        {/* Footer / resumen */}
        <div className="border-t border-[#162E93]/30 p-6">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-slate-400">Subtotal</span>
            <span className="text-lg font-extrabold text-white">
              {formatPrice(subtotal)}
            </span>
          </div>
          <button
            type="button"
            disabled={mockCartItems.length === 0}
            className="w-full cursor-pointer rounded-lg bg-[#2F2FE4] py-3 text-sm font-semibold text-white transition hover:bg-[#162E93] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar con la compra
          </button>
        </div>
      </div>
    </div>
  );
};
