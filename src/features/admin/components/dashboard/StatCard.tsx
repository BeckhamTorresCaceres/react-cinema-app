import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface StatCardProps {
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
  value: number;
  label: string;
  /** Contenido extra bajo el label, p. ej. el desglose admin/cliente del bloque de usuarios. */
  children?: ReactNode;
  /** Ajusta el padding en los extremos del panel (primer/último bloque). */
  edge?: "first" | "last" | "none";
}

export const StatCard = ({
  icon: Icon,
  iconBgClass,
  iconColorClass,
  value,
  label,
  children,
  edge = "none",
}: StatCardProps) => {
  const edgeClass =
    edge === "first" ? "first:pl-0" : edge === "last" ? "last:pr-0" : "";

  return (
    <div className={`flex items-center gap-4 py-4 md:py-0 md:px-6 ${edgeClass}`}>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBgClass} ${iconColorClass}`}
      >
        <Icon size={24} />
      </div>
      <div>
        <p className="text-2xl font-black text-white">{value}</p>
        {children ?? (
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {label}
          </p>
        )}
      </div>
    </div>
  );
};
