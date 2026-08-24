import { Link } from "react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import type { CartItem } from "../types/confiteria.types";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);

const getUnitPrice = (item: CartItem) =>
  item.product.hasPromo && item.product.discountPercent
    ? item.product.price * (1 - item.product.discountPercent / 100)
    : item.product.price;

export const CarritoPage = () => {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + getUnitPrice(item) * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#080616] text-white">
      {/* Hero de sección */}
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-extrabold text-white">
            Mi <span className="text-[#2F2FE4]">carrito</span>
          </h1>
          <p className="mt-2 text-slate-400">Edita las cantidades o cancela los productos que no quieras.</p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#162E93]/50 py-16 text-center">
            <ShoppingBag className="mx-auto mb-4 text-slate-500" size={40} />
            <p className="text-slate-400">Tu carrito está vacío.</p>
            <Link to="/confiteria" className="mt-4 inline-block text-[#8E8EFF] hover:underline">
              Ir a confitería
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex flex-col gap-4 rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/40 p-4 backdrop-blur-md sm:flex-row sm:items-center"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-white">{item.product.name}</h3>
                    <p className="text-xs text-slate-400">{formatPrice(getUnitPrice(item))} c/u</p>
                  </div>

                  {/* Editar cantidad */}
                  <div className="flex items-center gap-2 rounded-lg border border-[#162E93]/40 bg-[#080616] px-2 py-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="rounded-md p-1 text-slate-300 hover:bg-[#162E93]/40 hover:text-white"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="rounded-md p-1 text-slate-300 hover:bg-[#162E93]/40 hover:text-white"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <span className="w-24 text-right text-sm font-extrabold text-white">
                    {formatPrice(getUnitPrice(item) * item.quantity)}
                  </span>

                  {/* Cancelar producto del carrito */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="rounded-lg p-2 text-rose-400 hover:bg-rose-500/10"
                    title="Cancelar producto"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/40 p-6 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-slate-400">
                  {totalItems} producto{totalItems === 1 ? "" : "s"}
                </p>
                <p className="text-2xl font-extrabold text-white">{formatPrice(total)}</p>
              </div>
              <Link
                to="/confiteria"
                className="rounded-xl border border-[#162E93] px-4 py-2.5 text-center text-sm font-semibold text-slate-300 transition hover:border-[#2F2FE4] hover:text-white"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
