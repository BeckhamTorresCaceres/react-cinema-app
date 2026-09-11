import { Popcorn } from "lucide-react";

interface ConfirmSnacksPromptProps {
  isOpen: boolean;
  onConfirm: () => void;
  onSkip: () => void;
}

/**
 * Prompt que aparece justo después de confirmar los asientos, preguntando
 * si el cliente quiere agregar confitería antes de ir a pagar.
 */
export const ConfirmSnacksPrompt = ({ isOpen, onConfirm, onSkip }: ConfirmSnacksPromptProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-enter fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="snacks-prompt-title">
      <div className="modal-content-enter relative w-full max-w-sm rounded-2xl border border-[#162E93]/50 bg-[#0A071E] p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#2F2FE4]/15">
          <Popcorn size={26} className="text-[#8E8EFF]" />
        </div>
        <h3 id="snacks-prompt-title" className="mt-4 text-xl font-bold text-white">¿Quieres agregar confitería?</h3>
        <p className="mt-2 text-sm text-slate-400">Puedes sumar snacks y bebidas a tu compra antes de pagar.</p>
        <div className="mt-6 flex flex-col gap-3">
          <button type="button" onClick={onConfirm} className="w-full rounded-xl bg-[#2F2FE4] py-3 font-semibold text-white transition hover:bg-[#162E93]">
            Sí, agregar confitería
          </button>
          <button type="button" onClick={onSkip} className="w-full rounded-xl border border-[#162E93]/50 py-3 font-semibold text-slate-300 transition hover:border-[#2F2FE4] hover:text-white">
            No, continuar
          </button>
        </div>
      </div>
    </div>
  );
};
