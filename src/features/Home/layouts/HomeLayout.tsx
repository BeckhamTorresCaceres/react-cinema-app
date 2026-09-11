import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  CalendarClock,
  Clock3,
  MapPin,
  Menu,
  ShoppingCart,
  Ticket,
  User,
  X,
} from "lucide-react";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { LocationModal } from "@/features/locations/components/LocationModal";
import { hasSelectedLocation, useSelectedLocation } from "@/features/locations/hooks/useSelectedLocation";
import { CartModal } from "@/features/confiteria/components/CartModal";
import { ConfiteriaModal } from "@/features/confiteria/components/ConfiteriaModal";
import { useCartStore } from "@/features/confiteria/hooks/useCartStore";
import { Popcorn } from "lucide-react";
import { ReservationWarningModal } from "@/shared/components/ReservationWarningModal";

const navigationItems = [
  {
    label: "Cartelera",
    to: "/#cartelera",
    icon: Ticket,
    sectionId: "cartelera",
  },
  {
    label: "Próximamente",
    to: "/#proximamente",
    icon: CalendarClock,
    sectionId: "proximamente",
  },
  { label: "Confitería", to: "/confiteria", icon: Popcorn },
];

const isTicketFlowPath = (pathname: string) =>
  pathname === "/asientos" || pathname === "/checkout" || pathname === "/confiteria";

const formatReservationTime = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const HomeLayout = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const tickets = useCartStore((state) => state.tickets);
  const removeExpiredTickets = useCartStore((state) => state.removeExpiredTickets);
  const clearCart = useCartStore((state) => state.clear);
  const [now, setNow] = useState(() => Date.now());
  const cartItemCount = tickets.length;
  const nextExpiration = tickets.reduce<number | null>((earliest, ticket) => (
    earliest === null ? ticket.expiresAt : Math.min(earliest, ticket.expiresAt)
  ), null);
  const selectedLocation = useSelectedLocation();
  const hasLocation = hasSelectedLocation(selectedLocation);
  const selectedCity = selectedLocation.city;
  const closeMenu = () => setIsMenuOpen(false);
  const logoutUser = () => {
    if (cartItemCount > 0) {
      setPendingNavigation("/login");
      return;
    }
    logout();
    navigate("/login");
  };
  const openLocation = () => {
    closeMenu();
    setIsLocationModalOpen(true);
  };
  const scrollToSection = (sectionId: string) => {
    closeMenu();
    if (cartItemCount > 0) {
      setPendingNavigation(`/#${sectionId}`);
      return;
    }
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      return;
    }
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    removeExpiredTickets();
    if (!tickets.length) return;

    const expirationTimer = window.setInterval(() => {
      setNow(Date.now());
      removeExpiredTickets();
    }, 1000);
    return () => window.clearInterval(expirationTimer);
  }, [removeExpiredTickets, tickets.length]);

  useEffect(() => {
    if (!cartItemCount) return;

    const handleLinkClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target instanceof Element ? event.target.closest("a") : null;
      const href = target?.getAttribute("href");
      if (!target || !href || target.target === "_blank" || href.startsWith("#")) return;

      const destination = new URL(href, window.location.origin);
      if (destination.origin !== window.location.origin || isTicketFlowPath(destination.pathname)) return;

      event.preventDefault();
      setPendingNavigation(`${destination.pathname}${destination.search}${destination.hash}`);
    };

    document.addEventListener("click", handleLinkClick, true);
    return () => document.removeEventListener("click", handleLinkClick, true);
  }, [cartItemCount]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!cartItemCount) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [cartItemCount]);

  const confirmNavigation = () => {
    if (!pendingNavigation) return;
    const destination = pendingNavigation;
    setPendingNavigation(null);
    clearCart();
    if (destination === "/login") {
      logout();
    }
    navigate(destination);
  };

  useEffect(() => {
    const sectionId = location.hash.slice(1);
    if (!sectionId) return;
    requestAnimationFrame(() => {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash, location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-[#080616] text-white">
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-[#162E93]/30 bg-[#080616]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-wide text-white"
          >
            <span>Lumi</span>
            <span className="text-[#2F2FE4]">Films</span>
          </Link>
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Navegación principal"
          >
            <button
              type="button"
              onClick={openLocation}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-[#1A1953]/60 hover:text-white"
            >
              <MapPin size={16} />
              {selectedCity || "Ubicación"}
            </button>
            {navigationItems.map(({ label, to, icon: Icon, sectionId }) =>
              sectionId ? (
                <button
                  key={label}
                  type="button"
                  onClick={() => scrollToSection(sectionId)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-[#1A1953]/60 hover:text-white"
                >
                  <Icon size={16} />
                  {label}
                </button>
              ) : (
                <Link
                  key={label}
                  to={to}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-[#1A1953]/60 hover:text-white"
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ),
            )}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-[#1A1953]/60 hover:text-white"
            >
              <ShoppingCart size={16} />
              Carrito
              {cartItemCount > 0 && <span className="rounded-full bg-[#2F2FE4] px-1.5 py-0.5 text-xs font-bold text-white">{cartItemCount}</span>}
            </button>
          </nav>
          <div className="hidden items-center gap-3 sm:flex">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === "admin" ? "/admin" : "/perfil"}
                  className="flex items-center gap-2 rounded-full border border-[#162E93] bg-[#1A1953]/50 px-3 py-2 text-sm"
                >
                  <User size={16} />
                  {user?.name || user?.email}
                </Link>
                <button
                  type="button"
                  onClick={logoutUser}
                  className="rounded-lg border border-[#162E93] px-3 py-2 text-sm"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg border border-[#162E93] px-4 py-2 text-sm"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-[#2F2FE4] px-4 py-2 text-sm font-semibold"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="rounded-lg border border-[#162E93] p-2 lg:hidden"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {isMenuOpen && (
          <nav className="border-t border-[#162E93]/30 bg-[#080616] px-4 py-3 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <button
                type="button"
                onClick={openLocation}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-200"
              >
                <MapPin size={18} className="text-[#8E8EFF]" />
                {selectedCity || "Ubicación"}
              </button>
              {navigationItems.map(({ label, to, icon: Icon, sectionId }) =>
                sectionId ? (
                  <button
                    key={label}
                    type="button"
                    onClick={() => scrollToSection(sectionId)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-200"
                  >
                    <Icon size={18} className="text-[#8E8EFF]" />
                    {label}
                  </button>
                ) : (
                  <Link
                    key={label}
                    to={to}
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-200"
                  >
                    <Icon size={18} className="text-[#8E8EFF]" />
                    {label}
                  </Link>
                ),
              )}
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  setIsCartOpen(true);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-200"
              >
                <ShoppingCart size={18} className="text-[#8E8EFF]" />
                Carrito
                {cartItemCount > 0 && <span className="rounded-full bg-[#2F2FE4] px-1.5 py-0.5 text-xs font-bold text-white">{cartItemCount}</span>}
              </button>
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#162E93]/30 pt-3 sm:hidden">
                {isAuthenticated ? (
                  <>
                    <Link
                      to={user?.role === "admin" ? "/admin" : "/perfil"}
                      onClick={closeMenu}
                      className="rounded-lg border border-[#162E93] px-3 py-2.5 text-center text-sm"
                    >
                      Mi perfil
                    </Link>
                    <button
                      type="button"
                      onClick={logoutUser}
                      className="rounded-lg border border-[#162E93] px-3 py-2.5 text-sm"
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="rounded-lg border border-[#162E93] px-3 py-2.5 text-center text-sm"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMenu}
                      className="rounded-lg bg-[#2F2FE4] px-3 py-2.5 text-center text-sm font-semibold"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </header>
      {nextExpiration !== null && (
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className={`fixed right-4 top-20 z-30 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold shadow-lg backdrop-blur-md transition hover:scale-[1.02] sm:right-6 ${nextExpiration - now <= 60_000 ? "border-red-400/60 bg-red-950/90 text-red-200" : "border-[#8E8EFF]/50 bg-[#0A071E]/95 text-[#C7C7FF]"}`}
          aria-label="Ver tiempo restante de la reserva"
        >
          <Clock3 size={15} />
          Reserva: {formatReservationTime(nextExpiration - now)}
        </button>
      )}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <footer className="border-t border-[#162E93]/30 bg-[#080616] py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-xs text-slate-400 md:flex-row">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-slate-200">Lumi Films</span>.
            Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy">Privacidad</Link>
            <Link to="/terms">Términos</Link>
            <Link to="/contact">Contacto</Link>
          </div>
        </div>
      </footer>
      <LocationModal
        isOpen={!hasLocation || isLocationModalOpen}
        required={!hasLocation}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSelected={() => setIsLocationModalOpen(false)}
      />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <ConfiteriaModal />
      <ReservationWarningModal
        isOpen={Boolean(pendingNavigation)}
        onConfirm={confirmNavigation}
        onCancel={() => setPendingNavigation(null)}
      />
    </div>
  );
};
