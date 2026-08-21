import type { MembershipBenefit } from "../../types/membership.types";
import { MembershipBenefitIcon } from "./MembershipBenefitIcon";

export const MembershipBenefitCard = ({ benefit }: { benefit: MembershipBenefit }) => (
  <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#162E93]/30 bg-[#1A1953]/20 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#2F2FE4]/60 hover:bg-[#1A1953]/40">
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#2F2FE4]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-xl border border-[#162E93]/40 bg-[#080616]/60 p-3 shadow-inner transition-colors group-hover:border-[#2F2FE4]/40">
          <MembershipBenefitIcon name={benefit.icon} alternateColor={benefit.id % 2 === 0} />
        </div>
        {benefit.tag && <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider ${benefit.tag === "VIP" ? "border-purple-800/50 bg-purple-950/40 text-purple-400" : "border-cyan-800/50 bg-cyan-950/40 text-cyan-400"}`}>{benefit.tag}</span>}
      </div>
      <h3 className="mb-2 text-xl font-bold tracking-wide text-white transition-colors group-hover:text-[#9fe1f4]">{benefit.title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{benefit.description}</p>
    </div>
    <div className="mt-6 h-1 w-full bg-gradient-to-r from-transparent via-[#2F2FE4]/20 to-transparent transition-all duration-300 group-hover:via-[#2F2FE4]/60" />
  </article>
);
