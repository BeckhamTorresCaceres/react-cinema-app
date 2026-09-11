interface ReservationWarningModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ReservationWarningModal = ({ isOpen, onConfirm, onCancel }: ReservationWarningModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="reservation-warning-title">
      <div className="w-full max-w-2xl rounded-3xl border border-[#162E93]/60 bg-[#0A071E] px-6 py-8 text-center shadow-[0_0_40px_rgba(47,47,228,0.25)] sm:px-10">
        <h2 id="reservation-warning-title" className="text-2xl font-bold leading-tight text-white sm:text-3xl">
          Cuenta con una reserva en proceso. Al cambiar de página o salir se eliminará la reserva actual. ¿Desea continuar?
        </h2>
        <div className="mt-8 flex justify-center gap-3">
          <button type="button" onClick={onConfirm} className="rounded-full bg-[#2F2FE4] px-7 py-3 text-lg font-semibold text-white transition hover:bg-[#2424bd]">
            Sí
          </button>
          <button type="button" onClick={onCancel} className="rounded-full border border-[#8E8EFF]/60 bg-[#1A1953]/70 px-7 py-3 text-lg font-semibold text-[#C7C7FF] transition hover:border-[#8E8EFF] hover:bg-[#2F2FE4]/30">
            No
          </button>
        </div>
      </div>
    </div>
  );
};