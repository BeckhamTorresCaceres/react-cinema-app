import { ShoppingCart, Tag } from "lucide-react";
import type { SnackProduct } from "../types/confiteria.types";

interface ConfiteriaCardProps {
  product: SnackProduct;
  onAddToCart: (product: SnackProduct) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);

export const ConfiteriaCard = ({ product, onAddToCart }: ConfiteriaCardProps) => {
  const finalPrice = product.hasPromo && product.discountPercent
    ? product.price * (1 - product.discountPercent / 100)
    : product.price;

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-[#1A1953]/40 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${product.isAvailable ? "border-[#162E93]/40 hover:border-[#2F2FE4]" : "border-slate-700/40 opacity-60"}`}>

      {/* Imagen */}
      <div className="relative aspect-square w-full overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#080616] via-transparent to-transparent opacity-80" />


        {product.isFeatured && (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-blue-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
            ⭐️ Combo Estrella
          </span>
        )}



        {/* Badge promo */}
        {product.hasPromo && (
          <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
            <Tag size={10} />
            {product.promoLabel}
          </span>
        )}

        {/* Badge agotado */}
        {!product.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#080616]/70">
            <span className="rounded-full border border-slate-500 bg-[#080616]/80 px-4 py-2 text-sm font-bold text-slate-400">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-[#8E8EFF]">{product.name}</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">{product.description}</p>
        </div>

        <div className="mt-4">
          {/* Precio */}
          <div className="flex items-end gap-2">
            <span className="text-lg font-extrabold text-white">{formatPrice(finalPrice)}</span>
            {product.hasPromo && product.discountPercent && (
              <span className="mb-0.5 text-xs text-slate-500 line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* Botón agregar */}
          <button
            disabled={!product.isAvailable}
            onClick={() => onAddToCart(product)}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${product.isAvailable
                ? "bg-[#2F2FE4] text-white hover:bg-[#162E93]"
                : "cursor-not-allowed bg-slate-800 text-slate-500"
              }`}
          >
            <ShoppingCart size={15} />
            {product.isAvailable ? "Agregar al carrito" : "No disponible"}
          </button>
        </div>
      </div>
    </div>
  );
};