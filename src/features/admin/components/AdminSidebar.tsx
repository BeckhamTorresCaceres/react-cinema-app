import { Link, useLocation } from "react-router-dom";
import { Film, LayoutDashboard, LogOut, Clapperboard } from "lucide-react";
import path from "path";
import { Item } from "three/examples/jsm/inspector/ui/Item.js";
import { link } from "fs";

export const AdminSidebar = () => {
    const location = useLocation(); 

    const navItems = [
        {
            label: "Gestión de Películas",
            path: "/admin",
            icon: LayoutDashboard
        },
        {
            label: "Gestión de Películas",
            path: "/admin/movies",
            icon: Film,
        },
    ];

    return (
        <aside className="flex h-screen w-64 flex-col border-r border-[#162E93]/40 bg-[#080616] p-4 text-white">
            {/* Brand / Logo Header */}

            <div className="mb-8 flex items-center gap-3 px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F2FE4] shadow-lg shadow-[#2F2FE4]/30">
                    <Clapperboard className="h-6 w-6 text-white" />
                </div>

                <div>
                    <h2 className="font-extrabold tracking-wide text-white">LUMI FILMS</h2>
                    <span className="text-xs font-semibold text-[#8E8EFF]">Panel Admin</span>
                </div>
            </div>


        {/* Navegación Principal */}

        <nav className="flex-1 space-y-1.5">
            {navItems.map((item) => {
                const Icon = item.icon;
                const IsActive = location.pathname === item.path;

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration 200 ${ IsActive
                            ? "bg-[#2F2FE4] text-white shadow-md shadow-[#2F2FE4]/30"
                            : "text-slate-400 hover:bg-[#1A1953]/50 hover:text-white"
                        }`}
                    >
                        <Icon size={18} />
                        {item.label}
                    </Link>
                );
            })}
        </nav>

        {/* Footer / Salir */}

        <div className="border-t border border-[#162E93]/40 pt-4">
            <Link 
            to="/"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/10"
            >
                <LogOut size={18} />
                Volver a la App
            </Link>

        </div>
        </aside>
    );
};