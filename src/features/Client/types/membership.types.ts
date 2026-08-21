export type MembershipStatus = "ACTIVO" | "INACTIVO";

export interface MembershipCardData {
  name: string;
  id: string;
  memberSince: string;
  expiryDate: string;
  status: MembershipStatus;
}

export type MembershipBenefitIcon = "premier" | "tickets" | "snacks" | "presale" | "events" | "community";

export interface MembershipBenefit {
  id: string;
  title: string;
  description: string;
  icon: MembershipBenefitIcon;
  tag?: "Popular" | "VIP";
}
