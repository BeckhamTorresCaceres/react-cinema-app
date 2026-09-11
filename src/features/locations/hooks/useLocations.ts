import { useEffect, useState } from "react";
import { getLocations } from "../services/locationService";
import type { CountryLocation } from "../types/location.types";

interface LocationsCatalog {
  locations: CountryLocation[];
  isLoading: boolean;
}

/**
 * Carga el árbol completo de ubicaciones (países → departamentos →
 * ciudades → cines). Centraliza el patrón que antes se repetía en
 * BillboardSection y MovieDetailsPage.
 */
export const useLocations = (): LocationsCatalog => {
  const [locations, setLocations] = useState<CountryLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getLocations()
      .then((data) => {
        if (isMounted) setLocations(data);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  return { locations, isLoading };
};
