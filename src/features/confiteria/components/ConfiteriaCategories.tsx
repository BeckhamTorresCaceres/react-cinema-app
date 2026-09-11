import type { ConfiteriaCategoriasProps } from "../types/confiteria.types";
export const ConfiteriaCategorias = ({ categories, selected, onSelect }: ConfiteriaCategoriasProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((categ) => (
        <button
          key={categ}
          onClick={() => onSelect(categ)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            selected === categ
              ? "bg-[#2F2FE4] text-white shadow-md shadow-[#2F2FE4]/30"
              : "border border-[#162E93]/50 bg-[#1A1953]/40 text-slate-300 hover:border-[#2F2FE4] hover:text-white"
          }`}
        >
          {categ}
        </button>
      ))}
    </div>
  );
};