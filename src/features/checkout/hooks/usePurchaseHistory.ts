import { useEffect, useState } from "react";
import { getPurchaseHistory } from "../services/checkoutService";
import type { PurchaseHistoryItem } from "../types/checkout.types";

interface UsePurchaseHistoryResult {
  history: PurchaseHistoryItem[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Carga el historial de compras (tickets ya pagados) de un usuario.
 * Pasa `null` mientras no haya un usuario autenticado para evitar el fetch.
 */
export function usePurchaseHistory(userId: string | null | undefined): UsePurchaseHistoryResult {
  const [history, setHistory] = useState<PurchaseHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    void Promise.resolve()
      .then(() => {
        if (isMounted) {
          setIsLoading(true);
          setError(null);
        }
        return getPurchaseHistory(userId);
      })
      .then((data) => {
        if (isMounted) setHistory(data);
      })
      .catch(() => {
        if (isMounted) setError("No fue posible cargar tu historial de compras.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return {
    history: userId ? history : [],
    isLoading: userId ? isLoading : false,
    error: userId ? error : null,
  };
}
