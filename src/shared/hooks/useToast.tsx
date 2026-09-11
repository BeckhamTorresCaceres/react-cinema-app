import { useCallback, useState, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { ToastContext } from "./toastContext";

interface ToastMessage {
  id: number;
  text: string;
}

const TOAST_DURATION_MS = 2500;

/**
 * Proveedor de notificaciones toast, ligeras y de un solo uso (ej. "Combo
 * agregado a tu ticket"). Se monta una sola vez en la raíz de la app.
 */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, text }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, TOAST_DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-100 flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="toast-enter pointer-events-auto flex items-center gap-2 rounded-xl border border-[#2F2FE4]/40 bg-[#0A071E]/95 px-4 py-3 text-sm font-medium text-white shadow-2xl backdrop-blur-md"
          >
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            {toast.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
