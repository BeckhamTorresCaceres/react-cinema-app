import type { MembershipBenefit } from "@/features/Client/types/membership.types";
import { endpoints } from "./endpoints";
import { request } from "./http";

export async function getMembershipBenefits(): Promise<MembershipBenefit[]> {
  try {
    return await request<MembershipBenefit[]>(endpoints.membershipBenefits);
  } catch {
    throw new Error("No fue posible cargar los beneficios de la membresía.");
  }
}

export async function getMembershipBenefitById(id: string | number): Promise<MembershipBenefit> {
  return request<MembershipBenefit>(endpoints.membershipBenefitById(id));
}
