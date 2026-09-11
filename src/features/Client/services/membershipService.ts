import type { MembershipBenefit } from "@/features/client/types/membership.types";
import { endpoints } from "@/services/endpoints";
import { request } from "@/services/http";

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
