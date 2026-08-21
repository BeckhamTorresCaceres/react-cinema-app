import { Clock3, Gift, Star, Ticket, Users, Video } from "lucide-react";
import type { MembershipBenefitIcon as MembershipBenefitIconName } from "../../types/membership.types";

const icons = {
  premier: Video,
  tickets: Ticket,
  snacks: Gift,
  presale: Clock3,
  events: Star,
  community: Users,
};

export const MembershipBenefitIcon = ({ name, alternateColor = false }: { name: MembershipBenefitIconName; alternateColor?: boolean }) => {
  const Icon = icons[name];
  return <Icon size={24} className={alternateColor ? "text-[#2F2FE4]" : "text-[#9fe1f4]"} />;
};
