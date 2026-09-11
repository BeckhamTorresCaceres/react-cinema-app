import { useEffect, useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import { useNavigate } from "react-router";
import { CATEGORIES } from "../data/confiteria.mock";
import { ConfiteriaCard } from "./ConfiteriaCard";
import { ConfiteriaCategorias } from "./ConfiteriaCategories";
import { ConfiteriaBuscador } from "./ConfiteriaBuscador";
import { getSnacks } from "../services/snackService";
import type { SnackProduct } from "../types/confiteria.types";
import { useCartStore } from "../hooks/useCartStore";
import { useToast } from "@/shared/hooks/useToast.ts";

/**
 * Modal de confitería usado durante el flujo de compra (después de elegir
 * asientos, o desde "Agregar confitería a este ticket" en el carrito).
 * Agrega los snacks al ticket activo y, al terminar, lleva a /checkout.
 */
export const ConfiteriaModal = () => {
  const navigate = useNavigate();
  const isOpen = useCartStore((state) => state.isConfiteriaModalOpen);
  const closeConfiteriaModal = useCartStore((state) => state.closeConfiteriaModal);
  const activeTicketId = useCartStore((state) => state.activeTicketId);
  const tickets = useCartStore((state) => state.tickets);
  const addSnackToActiveTicket = useCartStore((state) => state.addSnackToActiveTicket);
  const { showToast } = useToast();

  const activeTicket = tickets.find((ticket) => ticket.id === activeTicketId) ?? null;

  const handleAddSnack = (product: SnackProduct) => {
    addSnackToActiveTicket(product);
    showToast(`${product.name} se agregó a tu ticket.`);
  };

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<SnackProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || products.length) return;

    let isMounted = true;
    getSnacks()
      .then((data) => {
        if (isMounted) setProducts(data);
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "No fue posible cargar los productos.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [isOpen, products.length]);

  if (!isOpen) return null;

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const goToCheckout = () => {
    closeConfiteriaModal();
    navigate("/checkout");
  };

  return (
    <div
      className="modal-overlay-enter fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confiteria-modal-title"
      onClick={closeConfiteriaModal}
    >
      <div
        className="modal-content-enter relative flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-[#162E93]/50 bg-[#0A071E] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#162E93]/30 p-6">
          <div>
            <h3 id="confiteria-modal-title" className="text-xl font-bold text-white">Agrega confitería</h3>
            {activeTicket && (
              <p className="mt-1 text-xs text-slate-400">Para {activeTicket.movieTitle} — asientos {activeTicket.seats.join(", ")}</p>
            )}
          </div>
          <button type="button" onClick={closeConfiteriaModal} className="rounded-lg p-2 text-slate-400 hover:bg-[#1A1953]/60 hover:text-white" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4 border-b border-[#162E93]/30 p-6 sm:flex-row sm:items-center sm:justify-between">
          <ConfiteriaCategorias categories={CATEGORIES} selected={selectedCategory} onSelect={setSelectedCategory} />
          <ConfiteriaBuscador value={searchTerm} onChange={setSearchTerm} />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="py-16 text-center text-slate-400">Cargando productos...</div>
          ) : error ? (
            <div className="rounded-2xl border border-dashed border-red-500/50 py-16 text-center">
              <p className="text-red-300">{error}</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ConfiteriaCard key={product.id} product={product} onAdd={handleAddSnack} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#162E93]/50 py-16 text-center">
              <p className="text-slate-400">No se encontraron productos.</p>
            </div>
          )}
        </div>

        <div className="border-t border-[#162E93]/30 p-6">
          <button
            type="button"
            onClick={goToCheckout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2F2FE4] py-3 font-semibold text-white transition hover:bg-[#162E93]"
          >
            <ShoppingCart size={18} />
            Ir a pagar
          </button>
        </div>
      </div>
    </div>
  );
};
