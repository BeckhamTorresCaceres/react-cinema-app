import { Search } from "lucide-react";

interface FilterState {
  searchTerm: string;
  genre: string;
  format: string;
  rating: string;
  complex: string;
}

interface BillboardFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
}

export const BillboardFilters = ({ filters, onFilterChange }: BillboardFiltersProps) => {
  return (
    <div className="mb-8 rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/40 p-3 backdrop-blur-md">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        
        {/* Buscador por texto */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar película..."
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            className="w-full rounded-xl border border-[#162E93]/60 bg-[#080616]/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-400 outline-none transition focus:border-[#2F2FE4] focus:ring-1 focus:ring-[#2F2FE4]"
          />
        </div>

        {/* Filtros Dropdown */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:w-auto">
          {/* Género */}
          <select
            value={filters.genre}
            onChange={(e) => onFilterChange({ genre: e.target.value })}
            className="w-full rounded-xl border border-[#162E93]/60 bg-[#080616]/80 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#2F2FE4] lg:w-36"
          >
            <option value="all">Género</option>
            <option value="Acción">Acción</option>
            <option value="Ciencia Ficción">Ciencia Ficción</option>
            <option value="Drama">Drama</option>
            <option value="Comedia">Comedia</option>
          </select>

          {/* Formato */}
          <select
            value={filters.format}
            onChange={(e) => onFilterChange({ format: e.target.value })}
            className="w-full rounded-xl border border-[#162E93]/60 bg-[#080616]/80 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#2F2FE4] lg:w-32"
          >
            <option value="all">Formato</option>
            <option value="2D">2D</option>
            <option value="3D">3D</option>
            <option value="IMAX">IMAX</option>
          </select>

          {/* Clasificación */}
          <select
            value={filters.rating}
            onChange={(e) => onFilterChange({ rating: e.target.value })}
            className="w-full rounded-xl border border-[#162E93]/60 bg-[#080616]/80 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#2F2FE4] lg:w-36"
          >
            <option value="all">Clasificación</option>
            <option value="TP">Todos los públicos</option>
            <option value="+13">+13 Años</option>
            <option value="+18">+18 Años</option>
          </select>

          {/* Complejo (Sede de la ciudad) */}
          <select
            value={filters.complex}
            onChange={(e) => onFilterChange({ complex: e.target.value })}
            className="w-full rounded-xl border border-[#2F2FE4]/80 bg-[#080616]/80 px-3 py-2.5 text-sm font-medium text-white outline-none transition focus:border-[#2F2FE4] focus:ring-1 focus:ring-[#2F2FE4] lg:w-44"
          >
            <option value="all">Complejo (Sede)</option>
            <option value="mall-plaza">Mall Plaza</option>
            <option value="buenavista">CC Buenavista</option>
            <option value="portal-prado">Portal del Prado</option>
          </select>
        </div>

      </div>
    </div>
  );
};