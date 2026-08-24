import { CheckCircle2, LoaderCircle, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useCartStore } from "@/features/cart/store/cartStore";
import { createOrder } from "../services/checkoutService";
import type { Order } from "../types/checkout.types";

const formatPrice = (price: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const confirmPurchase = async () => {
    if (!user?.id || items.length === 0) return;
    setIsSubmitting(true); setError(null);
    try { const createdOrder = await createOrder({ userId: user.id, items }); clearCart(); setOrder(createdOrder); }
    catch (purchaseError) { setError(purchaseError instanceof Error ? purchaseError.message : "No fue posible confirmar la compra."); }
    finally { setIsSubmitting(false); }
  };

  if (order) return <main className="mx-auto max-w-2xl px-4 py-16 text-center text-white"><CheckCircle2 size={54} className="mx-auto text-emerald-400" /><h1 className="mt-5 text-3xl font-extrabold">¡Compra confirmada!</h1><p className="mt-3 text-slate-300">Tu código de confirmación es <strong>{order.confirmationCode}</strong>.</p><p className="mt-2 text-sm text-slate-400">Esta orden se guardó en el servidor de pruebas.</p><Link to="/" className="mt-8 inline-block rounded-xl bg-[#2F2FE4] px-5 py-3 font-semibold">Volver a cartelera</Link></main>;
  if (items.length === 0) return <main className="mx-auto max-w-2xl px-4 py-16 text-center text-white"><h1 className="text-3xl font-extrabold">Tu carrito está vacío</h1><p className="mt-3 text-slate-400">Agrega una función antes de continuar.</p><Link to="/#cartelera" className="mt-8 inline-block text-[#8E8EFF] hover:underline">Ver cartelera</Link></main>;

  return <main className="mx-auto max-w-4xl px-4 py-10 text-white sm:px-6"><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8E8EFF]">Checkout</p><h1 className="mt-2 text-3xl font-extrabold">Confirma tu compra</h1><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]"><section className="rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/30 p-6"><h2 className="text-lg font-bold">Resumen</h2><ul className="mt-5 space-y-4">{items.map((item) => <li key={item.id} className="border-b border-[#162E93]/30 pb-4 last:border-0"><div className="flex justify-between gap-4"><div><p className="font-semibold">{item.name}</p><p className="mt-1 text-sm text-slate-400">{item.kind === "ticket" ? `${item.cinemaName} · ${item.showtimeLabel} · ${item.seats.join(", ")}` : item.description}</p></div><span className="whitespace-nowrap font-bold">{formatPrice(item.unitPrice * item.quantity)}</span></div></li>)}</ul></section><aside className="h-fit rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/40 p-6"><ShieldCheck className="text-[#8E8EFF]" /><h2 className="mt-3 font-bold">Pago de prueba</h2><p className="mt-2 text-sm text-slate-400">Al confirmar, validaremos de nuevo la disponibilidad de los asientos y registraremos la orden en json-server.</p><div className="my-5 flex justify-between border-t border-[#162E93]/40 pt-4"><span className="text-slate-400">Total</span><strong className="text-xl">{formatPrice(total)}</strong></div>{error && <p className="mb-4 rounded-lg border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}<button type="button" onClick={confirmPurchase} disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2F2FE4] py-3 font-semibold disabled:opacity-50">{isSubmitting && <LoaderCircle size={18} className="animate-spin" />}{isSubmitting ? "Confirmando..." : "Confirmar compra"}</button><button type="button" onClick={() => navigate(-1)} className="mt-3 w-full text-sm text-slate-400 hover:text-white">Volver</button></aside></div></main>;
};
