import type { MembershipBenefitsGridProps } from "../../types/membership.types";
import { MembershipBenefitCard } from "./MembershipBenefitCard";

export const MembershipBenefitsGrid = ({ benefits }: MembershipBenefitsGridProps) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {benefits.map((benefit) => <MembershipBenefitCard key={benefit.id} benefit={benefit} />)}
  </div>
);
