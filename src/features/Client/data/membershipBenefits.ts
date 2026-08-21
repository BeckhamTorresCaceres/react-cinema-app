import type { MembershipBenefit } from "../types/membership.types";

export const MEMBERSHIP_BENEFITS: MembershipBenefit[] = [
  {
    id: 1,
    title: "Funciones Premier Ilimitadas",
    description: "Acceso exclusivo a salas VIP y asientos reclinables de cuero en cualquier estreno sin costo adicional.",
    icon: "premier",
    tag: "Popular",
  },
  {
    id: 2,
    title: "2x1 en Entradas Generales",
    description: "Disfruta de tarifas preferenciales todos los días del año para acompañantes en formatos 2D, 3D e IMAX.",
    icon: "tickets",
  },
  {
    id: 3,
    title: "Dulcería Gourmet Gratis",
    description: "Un combo Platinum mediano (palomitas y refresco) sin costo en cada una de tus visitas al mes.",
    icon: "snacks",
  },
  {
    id: 4,
    title: "Preventas Exclusivas",
    description: "Adquiere tus boletos para los blockbusters más esperados 48 horas antes que el público general.",
    icon: "presale",
    tag: "VIP",
  },
  {
    id: 5,
    title: "Invitaciones a Alfombras Rojas",
    description: "Pases directos a eventos de gala, preestrenos con directores y sesiones de preguntas y respuestas con el elenco.",
    icon: "events",
  },
  {
    id: 6,
    title: "Eventos Comunitarios Privados",
    description: "Acceso a ciclos de cine independiente y debates mensuales organizados exclusivamente para miembros Platinum.",
    icon: "community",
  },
];
