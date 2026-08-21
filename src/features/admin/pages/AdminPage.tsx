import { useEffect, useState } from "react";
import { Film, Users, CalendarCheck, MapPin, ShieldCheck, UserCheck } from "lucide-react";
import { getMovies } from "@/services/movies";
import { getShowtimes } from "@/services/showtimes";
import { getUsers } from "@/services/users";
import { getLocations } from "@/services/locations";

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
          adminsCount: users.filter((user) => user.roleId === 1).length,
          clientsCount: users.filter((user) => user.roleId === 2).length,
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
          
          {/* Bloque 1: Películas */}
          <div className="flex items-center gap-4 py-4 md:py-0 md:px-6 first:pl-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F2FE4]/20 text-[#8E8EFF]">
              <Film size={24} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{data.moviesCount}</p>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Películas Activas</p>
            </div>
          </div>

          {/* Bloque 2: Usuarios */}
          <div className="flex items-center gap-4 py-4 md:py-0 md:px-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400">
              <Users size={24} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{data.usersCount}</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-0.5"><ShieldCheck size={12}/> {data.adminsCount} Admin</span>
                <span>•</span>
                <span className="flex items-center gap-0.5"><UserCheck size={12}/> {data.clientsCount} Clientes</span>
              </div>
            </div>
          </div>

          {/* Bloque 3: Funciones */}
          <div className="flex items-center gap-4 py-4 md:py-0 md:px-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
              <CalendarCheck size={24} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{data.showtimesCount}</p>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Funciones Programadas</p>
            </div>
          </div>

          {/* Bloque 4: Países */}
          <div className="flex items-center gap-4 py-4 md:py-0 md:px-6 last:pr-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{data.countriesCount}</p>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Países Operativos</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
