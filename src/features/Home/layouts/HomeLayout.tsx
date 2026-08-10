import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { MapPin, Menu, ShoppingCart, Ticket, User, X } from "lucide-react";
import { useAuthStore } from "../../auth/store/authStore";
import { LocationModal } from "@/features/location/components/LocationModal";

const navigationItems = [
  { label: "Cartelera", to: "/#cartelera", icon: Ticket },
  { label: "Carrito", to: "/checkout", icon: ShoppingCart },
];

export const HomeLayout = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const logoutUser = () => { logout(); navigate("/login"); };
  const openLocation = () => { closeMenu(); setIsLocationModalOpen(true); };

  return (
    <div className="flex min-h-screen flex-col bg-[#080616] text-white">
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-[#162E93]/30 bg-[#080616]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="text-2xl font-extrabold tracking-wide text-white"><span>Lumi</span><span className="text-[#2F2FE4]">Films</span></Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
            <button type="button" onClick={openLocation} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-[#1A1953]/60 hover:text-white"><MapPin size={16} />Ubicación</button>
            {navigationItems.map(({ label, to, icon: Icon }) => <Link key={label} to={to} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-[#1A1953]/60 hover:text-white"><Icon size={16} />{label}</Link>)}
          </nav>
          <div className="hidden items-center gap-3 sm:flex">{isAuthenticated ? <><Link to={user?.role === "admin" ? "/admin" : "/perfil"} className="flex items-center gap-2 rounded-full border border-[#162E93] bg-[#1A1953]/50 px-3 py-2 text-sm"><User size={16} />{user?.name || user?.email}</Link><button type="button" onClick={logoutUser} className="rounded-lg border border-[#162E93] px-3 py-2 text-sm">Cerrar sesión</button></> : <><Link to="/login" className="rounded-lg border border-[#162E93] px-4 py-2 text-sm">Iniciar sesión</Link><Link to="/register" className="rounded-lg bg-[#2F2FE4] px-4 py-2 text-sm font-semibold">Registrarse</Link></>}</div>
          <button type="button" onClick={() => setIsMenuOpen((open) => !open)} className="rounded-lg border border-[#162E93] p-2 lg:hidden" aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}>{isMenuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
        {isMenuOpen && <nav className="border-t border-[#162E93]/30 bg-[#080616] px-4 py-3 lg:hidden"><div className="mx-auto flex max-w-7xl flex-col gap-1"><button type="button" onClick={openLocation} className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-200"><MapPin size={18} className="text-[#8E8EFF]" />Ubicación</button>{navigationItems.map(({ label, to, icon: Icon }) => <Link key={label} to={to} onClick={closeMenu} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-200"><Icon size={18} className="text-[#8E8EFF]" />{label}</Link>)}</div></nav>}
      </header>
      <main className="flex-1 pt-16"><Outlet /></main>
      <footer className="border-t border-[#162E93]/30 bg-[#080616] py-6"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-xs text-slate-400 md:flex-row"><p>© {new Date().getFullYear()} <span className="font-semibold text-slate-200">Lumi Films</span>. Todos los derechos reservados.</p><div className="flex gap-6"><Link to="/privacy">Privacidad</Link><Link to="/terms">Términos</Link><Link to="/contact">Contacto</Link></div></div></footer>
      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
    </div>
  );
};
