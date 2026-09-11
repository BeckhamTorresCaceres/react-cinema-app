export type MembershipStatus = "ACTIVO" | "INACTIVO";

export interface MembershipCardData {
  name: string;
  id: string;
  memberSince: string;
  expiryDate: string;
  status: MembershipStatus;
}

export type MembershipBenefitIconName = "premier" | "tickets" | "snacks" | "presale" | "events" | "community";

export interface MembershipBenefit {
  id: string;
  title: string;
  description: string;
  icon: MembershipBenefitIconName;
  tag?: "Popular" | "VIP";
}

export interface MembershipBenefitIconProps {
  name: MembershipBenefitIconName;
  alternateColor?: boolean;
}

export interface MembershipBenefitCardProps {
  benefit: MembershipBenefit;
}

export interface MembershipBenefitsGridProps {
  benefits: MembershipBenefit[];
}

export interface MembershipPurchaseCtaProps {
  onPurchase: () => void;
}
