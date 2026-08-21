import { ShoppingCart } from "lucide-react";

export const MembershipPurchaseCta = ({ onPurchase }: { onPurchase: () => void }) => (
  <section className="mx-auto mt-16 flex max-w-2xl flex-col items-center rounded-3xl border border-[#2F2FE4]/30 bg-gradient-to-b from-[#1A1953]/30 to-[#080616] p-8 text-center shadow-2xl backdrop-blur-md">
    <h3 className="text-2xl font-bold tracking-wide text-white">¿Listo para mejorar tu experiencia?</h3>
    <p className="mb-6 mt-2 max-w-md text-sm text-slate-400">Adquiere o renueva tu suscripción Platinum ahora mismo y desbloquea todos estos beneficios digitales al instante.</p>
    <button onClick={onPurchase} className="group relative flex items-center gap-2 rounded-xl bg-[#2F2FE4] px-8 py-3.5 font-semibold tracking-wide text-white shadow-lg shadow-[#2F2FE4]/40 transition-all duration-300 hover:bg-[#2020bc] active:scale-95">
      <ShoppingCart size={20} className="transition-transform group-hover:translate-x-1" />
      Obtener Membresía Platinum
    </button>
  </section>
);
