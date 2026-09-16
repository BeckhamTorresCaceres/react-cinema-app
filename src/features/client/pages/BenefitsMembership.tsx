import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { MembershipBenefitsGrid, MembershipPurchaseCta } from "../components";
import type { MembershipBenefit } from "../types/membership.types";
import { getMembershipBenefits } from "@/features/client/services/membershipService";

const BenefitsMembership = () => {
  const navigate = useNavigate();
  const [benefits, setBenefits] = useState<MembershipBenefit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMembershipBenefits()
      .then(setBenefits)
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "No fue posible cargar los beneficios.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#080616] px-4 py-12 text-white md:px-6">
      <div className="w-full max-w-6xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#2F2FE4]">LumiFilms Club</p>

        <header className="mb-12 flex flex-col justify-between gap-4 border-b border-[#162E93]/20 pb-8 md:flex-row md:items-end">
          <div>
            <h1 className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-4xl font-extrabold tracking-wide text-transparent">BENEFICIOS PLATINUM</h1>
            <p className="mt-2 text-lg text-slate-400">Tu pase VIP para vivir el cine al máximo nivel.</p>
          </div>
          <div className="w-fit self-start rounded-full bg-gradient-to-r from-[#e5e5e5] via-white to-[#b3b3b3] px-4 py-2 text-xs font-black tracking-[1.5px] text-[#111] shadow-lg shadow-white/5 md:self-auto">VIP STATUS ACTIVE</div>
        </header>

        {isLoading ? (
          <div className="py-16 text-center text-slate-400">Cargando beneficios...</div>
        ) : error ? (
          <div className="rounded-2xl border border-dashed border-red-500/50 py-16 text-center text-red-300">{error}</div>
        ) : (
          <MembershipBenefitsGrid benefits={benefits} />
        )}
        <MembershipPurchaseCta onPurchase={() => navigate("/checkout")} />

        <p className="mt-12 text-center text-xs tracking-wide text-slate-500">* Los beneficios están sujetos a disponibilidad de sala y términos del programa LumiFilms Platinum 2026.</p>
      </div>
    </main>
  );
};

export default BenefitsMembership;
