import { Search } from "lucide-react";

interface ConfiteriaBuscadorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ConfiteriaBuscador = ({ value, onChange }: ConfiteriaBuscadorProps) => {
  return (
    <div className="relative w-full max-w-sm">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder="Buscar producto..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#162E93]/50 bg-[#1A1953]/40 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#2F2FE4] focus:ring-1 focus:ring-[#2F2FE4]"
      />
    </div>
  );
};