import type { SnackProduct } from "@/features/confiteria/types/confiteria.types";
import { endpoints } from "./endpoints";
import { request } from "./http";

export async function getSnacks(): Promise<SnackProduct[]> {
  try {
    return await request<SnackProduct[]>(endpoints.snacks);
  } catch {
    throw new Error("No fue posible cargar los productos de confitería.");
  }
}

export async function getSnackById(id: string | number): Promise<SnackProduct> {
  return request<SnackProduct>(endpoints.snackById(id));
}

export async function getSnacksByCategory(category: string): Promise<SnackProduct[]> {
  return request<SnackProduct[]>(endpoints.snacksByCategory(category));
}

export async function getAvailableSnacks(): Promise<SnackProduct[]> {
  return request<SnackProduct[]>(endpoints.availableSnacks);
}
