import { AlertTriangle } from "lucide-react";

interface DeleteMovieModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteMovieModal = ({ onCancel, onConfirm }: DeleteMovieModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-[#080616] p-6 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-500">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-lg font-bold text-white">¿Confirmas la eliminación?</h3>
        <p className="mt-2 text-xs text-slate-400">
          Esta acción removerá la película del sistema permanentemente.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
