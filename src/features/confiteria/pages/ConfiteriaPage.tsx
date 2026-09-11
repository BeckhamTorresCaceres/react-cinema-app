import { useEffect, useState } from "react";
import { CATEGORIES } from "../data/confiteria.mock";
import { ConfiteriaCard } from "../components/ConfiteriaCard";
import { ConfiteriaCategorias } from "../components/ConfiteriaCategories";
import { ConfiteriaBuscador } from "../components/ConfiteriaBuscador";
import type { SnackProduct } from "../types/confiteria.types";
import { getSnacks } from "@/features/confiteria/services/snackService";
import { useCartStore } from "../hooks/useCartStore";
import { useToast } from "@/shared/hooks/useToast.ts";

export const ConfiteriaPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<SnackProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addSnackToActiveTicket = useCartStore((state) => state.addSnackToActiveTicket);
  const activeTicketId = useCartStore((state) => state.activeTicketId);
  const { showToast } = useToast();

  useEffect(() => {
    const loadSnacks = async () => {
      try {
        setProducts(await getSnacks());
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "No fue posible cargar los productos.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadSnacks();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  
  
  const handleAddToCart = (product: SnackProduct) => {
    addSnackToActiveTicket(product);
    showToast(`${product.name} se agregó a tu ticket.`);
  };

  return (
    <div className="min-h-screen bg-[#080616] text-white">
      {/* Hero de sección */}
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-extrabold text-white">
            Confi<span className="text-[#2F2FE4]">tería</span>
          </h1>
          <p className="mt-2 text-slate-400">
            Elige tus snacks favoritos y Disfrutalos con la funcion.
          </p>
          {!activeTicketId && (
            <p className="mt-3 inline-flex items-center rounded-full border border-[#162E93]/50 bg-[#1A1953]/40 px-4 py-1.5 text-xs text-slate-400">
              Selecciona una función y tus asientos para poder agregar confitería a tu compra.
            </p>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Barra de filtros */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ConfiteriaCategorias
            categories={CATEGORIES}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <ConfiteriaBuscador value={searchTerm} onChange={setSearchTerm} />
        </div>

        {/* Grid de productos */}
        {isLoading ? (
          <div className="py-16 text-center text-slate-400">Cargando productos...</div>
        ) : error ? (
          <div className="rounded-2xl border border-dashed border-red-500/50 py-16 text-center">
            <p className="text-red-300">{error}</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ConfiteriaCard
                key={product.id}
                product={product}
                onAdd={activeTicketId ? handleAddToCart : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#162E93]/50 py-16 text-center">
            <p className="text-slate-400">No se encontraron productos.</p>
          </div>
        )}
      </div>
    </div>
  );
};
