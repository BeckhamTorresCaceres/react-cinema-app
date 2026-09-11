import type { SnackProduct } from "@/features/confiteria/types/confiteria.types";
import { endpoints } from "@/services/endpoints";
import { request } from "@/services/http";

export async function getSnacks(): Promise<SnackProduct[]> {
  try {
    return await request<SnackProduct[]>(endpoints.snacks);
  } catch {
    throw new Error("No fue posible cargar los productos de confitería.");
  }
}
