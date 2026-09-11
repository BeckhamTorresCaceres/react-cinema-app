import { useEffect, useState } from "react";
import { Film, Users, CalendarCheck, MapPin, ShieldCheck, UserCheck } from "lucide-react";
import { getMovies, getShowtimes } from "@/features/billboard/services/billboardService";
import { getUsers } from "@/features/users/services/userService";
import { getLocations } from "@/features/locations/services/locationService";
import { StatCard } from "../components/dashboard/StatCard";

export const AdminPage = () => {
  const [data, setData] = useState({
    moviesCount: 0,
    usersCount: 0,
    adminsCount: 0,
    clientsCount: 0,
    showtimesCount: 0,
    countriesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [movies, users, showtimes, locations] = await Promise.all([
          getMovies(),
          getUsers(),
          getShowtimes(),
          getLocations(),
        ]);

        setData({
          moviesCount: movies.length,
          usersCount: users.length,
          adminsCount: users.filter((user) => Number(user.roleId) === 1).length,
          clientsCount: users.filter((user) => Number(user.roleId) === 2).length,
          showtimesCount: showtimes.length,
          countriesCount: locations.length,
        });
      } catch (err) {
        console.error("Error al obtener datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-slate-400">Cargando métricas unificadas...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Panel de Control</h1>
        <p className="mt-1 text-sm text-slate-400">Resumen general consolidado de la plataforma</p>
      </div>

      {/* PANEL UNIFICADO DE ESTADÍSTICAS */}
      <div className="rounded-3xl border border-[#162E93]/50 bg-[#1A1953]/20 p-6 backdrop-blur-md shadow-xl">
        <div className="grid grid-cols-1 divide-y divide-[#162E93]/40 md:grid-cols-4 md:divide-x md:divide-y-0">
          <StatCard
            icon={Film}
            iconBgClass="bg-[#2F2FE4]/20"
            iconColorClass="text-[#8E8EFF]"
            value={data.moviesCount}
            label="Películas Activas"
            edge="first"
          />

          <StatCard
            icon={Users}
            iconBgClass="bg-purple-500/20"
            iconColorClass="text-purple-400"
            value={data.usersCount}
            label="Usuarios"
          >
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-0.5">
                <ShieldCheck size={12} /> {data.adminsCount} Admin
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <UserCheck size={12} /> {data.clientsCount} Clientes
              </span>
            </div>
          </StatCard>

          <StatCard
            icon={CalendarCheck}
            iconBgClass="bg-emerald-500/20"
            iconColorClass="text-emerald-400"
            value={data.showtimesCount}
            label="Funciones Programadas"
          />

          <StatCard
            icon={MapPin}
            iconBgClass="bg-amber-500/20"
            iconColorClass="text-amber-400"
            value={data.countriesCount}
            label="Países Operativos"
            edge="last"
          />
        </div>
      </div>
    </div>
  );
};
