import { useEffect, useState } from "react";
import type { SelectedLocation } from "../types/location.types";

const STORAGE_KEYS = {
  country: "lumi_pais",
  department: "lumi_departamento",
  city: "lumi_ciudad",
} as const;

export const LOCATION_CHANGED_EVENT = "lumi-location-changed";

export const readSelectedLocation = (): SelectedLocation => ({
  country: localStorage.getItem(STORAGE_KEYS.country) || "",
  department: localStorage.getItem(STORAGE_KEYS.department) || "",
  city: localStorage.getItem(STORAGE_KEYS.city) || "",
});

export const saveSelectedLocation = (location: SelectedLocation): void => {
  localStorage.setItem(STORAGE_KEYS.country, location.country);
  localStorage.setItem(STORAGE_KEYS.department, location.department);
  localStorage.setItem(STORAGE_KEYS.city, location.city);
  window.dispatchEvent(new Event(LOCATION_CHANGED_EVENT));
};

export const hasSelectedLocation = (location: SelectedLocation = readSelectedLocation()): boolean =>
  Boolean(location.country && location.department && location.city);

/**
 * Devuelve la ubicación seleccionada por el usuario (país/departamento/ciudad)
 * y se mantiene sincronizado entre componentes escuchando el evento
 * `lumi-location-changed` que dispara `saveSelectedLocation`.
 */
export const useSelectedLocation = (): SelectedLocation => {
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>(readSelectedLocation);

  useEffect(() => {
    const updateSelectedLocation = () => setSelectedLocation(readSelectedLocation());
    window.addEventListener(LOCATION_CHANGED_EVENT, updateSelectedLocation);
    return () => window.removeEventListener(LOCATION_CHANGED_EVENT, updateSelectedLocation);
  }, []);

  return selectedLocation;
};
