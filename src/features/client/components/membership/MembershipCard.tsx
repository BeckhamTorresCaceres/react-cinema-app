import type { MembershipCardData } from "../../types/membership.types";

export const MembershipCard = ({ name, id, memberSince, expiryDate, status }: MembershipCardData) => (
  <div className="relative flex h-[220px] w-[350px] flex-col justify-between overflow-hidden rounded-[15px] border border-white/10 bg-gradient-to-br from-[#2c3e50] to-black p-5 font-sans text-white shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
    <div className="pointer-events-none absolute inset-[-50%] h-[200%] w-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)]" />

    <div className="relative z-10 flex items-center justify-between">
      <div className="bg-gradient-to-r from-[#9fe1f4] to-[#dfeff4] bg-clip-text text-[20px] font-extrabold tracking-[1.5px] text-transparent">LumiFilms</div>
      <div className="rounded-full bg-gradient-to-r from-[#e5e5e5] via-white to-[#b3b3b3] px-2 py-1 text-[9px] font-black tracking-[1px] text-[#111] shadow-[0_2px_5px_rgba(0,0,0,0.2)]">PLATINUM VIP</div>
    </div>

    <div className="relative z-10 mt-1 h-7 w-10 rounded-md border border-white/20 bg-gradient-to-br from-[#e0a96d] to-[#966b38]" />

    <div className="relative z-10 mb-[15px] mt-auto">
      <div className="mb-1 text-[18px] font-medium uppercase tracking-[2px]">{name}</div>
      <div className="font-mono text-[14px] tracking-[1.5px] text-[#cccccc]">ID: {id}</div>
    </div>

    <div className="relative z-10 flex items-end justify-between border-t border-white/15 pt-2.5">
      <MembershipDate label="Miembro desde" value={memberSince} />
      <MembershipDate label="Expira" value={expiryDate} />
      <div className="flex items-center rounded border border-white/5 bg-black/40 px-2 py-1">
        <div className={`mr-1.5 h-1.5 w-1.5 rounded-full shadow-[0_0_8px] ${status === "ACTIVO" ? "bg-[#2ecc71] shadow-[#2ecc71]" : "bg-[#e74c3c] shadow-[#e74c3c]"}`} />
        <span className={`text-[9px] font-bold tracking-[0.5px] ${status === "ACTIVO" ? "text-[#2ecc71]" : "text-[#e74c3c]"}`}>{status}</span>
      </div>
    </div>
  </div>
);

const MembershipDate = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="mb-0.5 text-[8px] uppercase tracking-[0.5px] text-[#888888]">{label}</div>
    <div className="text-[11px] font-semibold">{value}</div>
  </div>
);
