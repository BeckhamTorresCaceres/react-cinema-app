import { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, Tag, Eye, AlertTriangle, X } from "lucide-react";
import { createSnack, deleteSnack, getSnacks, updateSnack } from "@/services/snacks";
import { CATEGORIES } from "@/features/confiteria/data/confiteria.mock";
import type { SnackProduct } from "@/features/confiteria/types/confiteria.types";

const categoryOptions = CATEGORIES.filter((category) => category !== "Todos");

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);

export const AdminConfiteriaPage = () => {
  const [products, setProducts] = useState<SnackProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<SnackProduct | null>(null); // Modal Ver Detalle
  const [editingProduct, setEditingProduct] = useState<SnackProduct | null>(null); // Modal Editar/Crear
  const [cancelingId, setCancelingId] = useState<string | null>(null); // Modal Confirmar Cancelación

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image: "https://picsum.photos/seed/snack/400/400",
    category: categoryOptions[0],
    isAvailable: true,
    hasPromo: false,
    promoLabel: "",
    discountPercent: 0,
  });

  useEffect(() => {
    getSnacks()
      .then(setProducts)
      .catch((error: unknown) => console.error(error));
  }, []);

  const fetchProducts = async () => {
    try {
      setProducts(await getSnacks());
    } catch (error) {
      console.error(error);
    }
  };

  // Abrir Modal de Edición cargando datos actuales
  const handleOpenEdit = (product: SnackProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      isAvailable: product.isAvailable,
      hasPromo: product.hasPromo,
      promoLabel: product.promoLabel || "",
      discountPercent: product.discountPercent || 0,
    });
  };

  // Crear o Editar Producto
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = Boolean(editingProduct?.id);

    const payload = {
      ...formData,
      promoLabel: formData.hasPromo ? formData.promoLabel : undefined,
      discountPercent: formData.hasPromo ? formData.discountPercent : undefined,
    };

    if (isEdit && editingProduct?.id) {
      await updateSnack(editingProduct.id, payload);
    } else {
      await createSnack(payload);
    }

    fetchProducts();
    setEditingProduct(null);
  };

  // Confirmar y Cancelar Producto
  const confirmCancel = async () => {
    if (!cancelingId) return;
    await deleteSnack(cancelingId);
    setProducts(products.filter((p) => p.id !== cancelingId));
    setCancelingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Catálogo de Confitería</h1>
          <p className="mt-1 text-sm text-slate-400">Administra los productos de la confitería</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct({} as SnackProduct);
            setFormData({
              name: "",
              description: "",
              price: 0,
              image: "https://picsum.photos/seed/snack/400/400",
              category: categoryOptions[0],
              isAvailable: true,
              hasPromo: false,
              promoLabel: "",
              discountPercent: 0,
            });
          }}
          className="flex items-center gap-2 rounded-xl bg-[#2F2FE4] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2F2FE4]/30 transition hover:bg-[#162E93]"
        >
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="overflow-hidden rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/20">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-[#162E93]/40 bg-[#080616]/60 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#162E93]/20">
            {products.map((product) => (
              <tr key={product.id} className="transition hover:bg-[#1A1953]/40">
                <td
                  onClick={() => setSelectedProduct(product)}
                  className="px-6 py-4 font-semibold text-white cursor-pointer hover:text-[#8E8EFF] flex items-center gap-3"
                >
                  <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover" />
                  <span>{product.name}</span>
                </td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">
                  <span className="font-bold text-white">{formatPrice(product.price)}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      product.isAvailable ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700/40 text-slate-400"
                    }`}
                  >
                    {product.isAvailable ? "Disponible" : "Agotado"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-1">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-[#162E93]/40 hover:text-white"
                    title="Ver detalle"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(product)}
                    className="rounded-lg p-2 text-blue-400 hover:bg-blue-500/10"
                    title="Editar"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => setCancelingId(product.id)}
                    className="rounded-lg p-2 text-rose-400 hover:bg-rose-500/10"
                    title="Cancelar"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 1. MODAL DETALLE DE PRODUCTO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#162E93] bg-[#080616] p-6 shadow-2xl text-white">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="flex gap-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="h-32 w-32 rounded-xl object-cover border border-[#162E93]"
              />
              <div className="space-y-2 text-xs">
                <h2 className="text-xl font-bold text-white">{selectedProduct.name}</h2>
                <p className="text-slate-400">{selectedProduct.description}</p>
                <p><span className="text-slate-400">Categoría:</span> {selectedProduct.category}</p>
                <p><span className="text-slate-400">Precio:</span> {formatPrice(selectedProduct.price)}</p>
                <p><span className="text-slate-400">Estado:</span> {selectedProduct.isAvailable ? "Disponible" : "Agotado"}</p>
                {selectedProduct.hasPromo && (
                  <div className="flex items-center gap-1 pt-2 text-sm font-bold text-amber-400">
                    <Tag size={14} /> {selectedProduct.promoLabel} (-{selectedProduct.discountPercent}%)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL CONFIRMAR CANCELACIÓN */}
      {cancelingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-[#080616] p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-500">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">¿Confirmas la cancelación?</h3>
            <p className="mt-2 text-xs text-slate-400">Esta acción removerá el producto de la confitería permanentemente.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setCancelingId(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Volver
              </button>
              <button
                onClick={confirmCancel}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODAL CREAR / EDITAR */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#162E93] bg-[#080616] p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingProduct.id ? "Editar Producto" : "Nuevo Producto"}
            </h2>
            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nombre</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Descripción</label>
                <input
                  required
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Precio</label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Imagen (URL)</label>
                <input
                  required
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="isAvailable"
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="h-4 w-4 rounded border-[#162E93] bg-[#1A1953]/50"
                />
                <label htmlFor="isAvailable" className="text-xs text-slate-300">
                  Disponible para la venta
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="hasPromo"
                  type="checkbox"
                  checked={formData.hasPromo}
                  onChange={(e) => setFormData({ ...formData, hasPromo: e.target.checked })}
                  className="h-4 w-4 rounded border-[#162E93] bg-[#1A1953]/50"
                />
                <label htmlFor="hasPromo" className="text-xs text-slate-300">
                  Tiene promoción
                </label>
              </div>
              {formData.hasPromo && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Etiqueta promo</label>
                    <input
                      type="text"
                      value={formData.promoLabel}
                      onChange={(e) => setFormData({ ...formData, promoLabel: e.target.value })}
                      className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Descuento (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.discountPercent}
                      onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                      className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]"
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="rounded-xl px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button type="submit" className="rounded-xl bg-[#2F2FE4] px-4 py-2 text-xs font-semibold text-white">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
