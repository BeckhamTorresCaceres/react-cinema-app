import { useMemo } from "react";
import type { SeatCell } from "../types/seats.types";
import { buildSeatLayout, VIP_ROWS } from "../utils/seatLayout";

interface SeatMapProps {
  occupied: string[];
  selected: string[];
  onToggle: (seatId: string) => void;
  disabled?: boolean;
}

const layout = buildSeatLayout();

const seatClass = (cell: SeatCell, occupied: Set<string>, selected: Set<string>, disabled: boolean) => {
  if (occupied.has(cell.id)) {
    return "cursor-not-allowed bg-slate-700 text-slate-500 border-slate-600";
  }

  if (selected.has(cell.id)) {
    return "border-[#2F2FE4] bg-[#2F2FE4] text-white shadow-md shadow-[#2F2FE4]/40";
  }

  if (disabled) {
    return "cursor-not-allowed border-[#162E93]/40 bg-[#080616]/40 text-slate-600";
  }

  if (VIP_ROWS.has(cell.row)) {
    return "border-amber-400/60 bg-amber-400/10 text-amber-200 hover:bg-amber-400/25";
  }

  return "border-[#162E93]/70 bg-[#1A1953]/70 text-slate-200 hover:border-[#8E8EFF] hover:bg-[#2F2FE4]/25";
};

export const SeatMap = ({ occupied, selected, onToggle, disabled = false }: SeatMapProps) => {
  const occupiedSet = useMemo(() => new Set(occupied), [occupied]);
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="mx-auto min-w-[520px] max-w-3xl">
        <div className="relative mb-8">
          <div className="mx-auto h-2 w-4/5 rounded-full bg-linear-to-r from-transparent via-[#8E8EFF] to-transparent shadow-[0_8px_24px_rgba(142,142,255,0.45)]" />
          <p className="mt-3 text-center text-[11px] font-bold uppercase tracking-[0.35em] text-slate-400">
            Pantalla
          </p>
        </div>

        <div className="space-y-2">
          {layout.map((row) => (
            <div key={row[0].row} className="flex items-center justify-center gap-1.5">
              <span className="w-5 text-center text-xs font-bold text-slate-500">{row[0].row}</span>
              {row.map((cell) =>
                cell.isAisle ? (
                  <span key={cell.id} className="w-5 shrink-0" aria-hidden />
                ) : (
                  <button
                    key={cell.id}
                    type="button"
                    disabled={disabled || occupiedSet.has(cell.id)}
                    onClick={() => onToggle(cell.id)}
                    aria-label={`Asiento ${cell.id}${occupiedSet.has(cell.id) ? " ocupado" : selectedSet.has(cell.id) ? " seleccionado" : " disponible"}`}
                    aria-pressed={selectedSet.has(cell.id)}
                    className={`flex h-7 w-7 items-center justify-center rounded-t-md border text-[10px] font-semibold transition active:scale-95 disabled:active:scale-100 sm:h-8 sm:w-8 ${seatClass(cell, occupiedSet, selectedSet, disabled)}`}
                  >
                    {cell.number}
                  </button>
                )
              )}
              <span className="w-5 text-center text-xs font-bold text-slate-500">{row[0].row}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <LegendSwatch className="border-[#162E93]/70 bg-[#1A1953]/70" label="Disponible" />
          <LegendSwatch className="border-amber-400/60 bg-amber-400/10" label="Preferencial" />
          <LegendSwatch className="border-[#2F2FE4] bg-[#2F2FE4]" label="Seleccionado" />
          <LegendSwatch className="border-slate-600 bg-slate-700" label="Ocupado" />
        </div>
      </div>
    </div>
  );
};

const LegendSwatch = ({ className, label }: { className: string; label: string }) => (
  <span className="inline-flex items-center gap-2">
    <span className={`h-4 w-4 rounded-t-sm border ${className}`} />
    {label}
  </span>
);
