import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Building2, MapPin, Menu, ShoppingCart, Ticket, X } from "lucide-react";

const navigationItems = [
  { label: "Ubicación", to: "/#ubicacion", icon: MapPin },
  { label: "Multicine", to: "/#multicine", icon: Building2 },
  { label: "Cartelera", to: "/#cartelera", icon: Ticket },
  { label: "Carrito", to: "/checkout", icon: ShoppingCart },
];

const listaPaises: Record<string, string[]> = {
  Colombia: ["Atlántico", "Antioquia", "Bogotá D.C.", "Valle del Cauca"],
  México: ["CDMX", "Jalisco", "Nuevo León", "Estado de México"],
  Argentina: ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza"]
};

export const HomeLayout = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalUbicacion, setModalUbicacion] = useState<boolean>(false);
  const [pais, setPais] = useState<string>("");
  const [departamento, setDepartamento] = useState<string>("");

  const handleAplicar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setModalUbicacion(false);
    alert(`Ubicación: ${pais}, ${departamento}`);
  };
  
  // Se ejecuta al cargar el componente, interceptando de forma aislada
    useEffect(() => {
    const manejarClicUbicacion = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const enlace = target.closest('a[href="/#ubicacion"]');
      
      if (enlace) {
        e.preventDefault();
        setIsMenuOpen(false);      // Cierra el menú desplegable de fondo si estás en móvil
        setModalUbicacion(true);   // Abre tu modal limpio
      }
    };

    document.addEventListener("click", manejarClicUbicacion);
    return () => document.removeEventListener("click", manejarClicUbicacion);
  }, []);




  return (
    <div className="flex min-h-screen flex-col bg-[#080616] text-white">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#162E93]/30 bg-[#080616]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="text-2xl font-extrabold tracking-wide text-white transition hover:opacity-90">
            Lumi<span className="text-[#2F2FE4]">Films</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
            {navigationItems.map(({ label, to, icon: Icon }) => (
              <Link key={label} to={to} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-[#1A1953]/60 hover:text-white">
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            {location.pathname !== "/login" && (
              <Link to="/login" className="rounded-lg border border-[#162E93] bg-[#1A1953]/40 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:border-[#2F2FE4] hover:bg-[#162E93]/50">
                Iniciar sesión
              </Link>
            )}
            {location.pathname !== "/register" && (
              <Link to="/register" className="rounded-lg bg-[#2F2FE4] px-4 py-2 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-[#162E93]">
                Registrarse
              </Link>
            )}
          </div>

          <button type="button" onClick={() => setIsMenuOpen((open) => !open)} className="rounded-lg border border-[#162E93] p-2 text-white transition hover:border-[#2F2FE4] hover:bg-[#1A1953]/60 lg:hidden" aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={isMenuOpen}>
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="border-t border-[#162E93]/30 bg-[#080616] px-4 py-3 lg:hidden" aria-label="Navegación móvil">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {navigationItems.map(({ label, to, icon: Icon }) => (
                <Link key={label} to={to} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-200 transition hover:bg-[#1A1953]/60">
                  <Icon size={18} className="text-[#8E8EFF]" />
                  {label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-3 border-t border-[#162E93]/30 pt-3">
                {location.pathname !== "/login" && (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="rounded-lg border border-[#162E93] bg-[#1A1953]/40 px-3 py-2 text-center text-sm font-medium">
                    Iniciar sesión
                  </Link>
                )}
                {location.pathname !== "/register" && (
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="rounded-lg bg-[#2F2FE4] px-3 py-2 text-center text-sm font-semibold">
                    Registrarse
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </header>
      {modalUbicacion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md rounded-2xl border border-[#162E93] bg-[#0A071E] p-6 shadow-2xl">
              
                <button type="button" onClick={() => setModalUbicacion(false)} className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <MapPin size={24} className="text-[#8E8EFF]" />
                <div>
                  <h3 className="text-xl font-bold">Selecciona tu ubicación</h3>
                  <p className="text-xs text-slate-400">Selecciona tu región para ver la cartelera local</p>
                </div>
              </div>
              
              <form onSubmit={handleAplicar} className="space-y-4">
            
            {/* Selector de País (Añadido por ti) */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-300">País</label>
              <select 
                required 
                value={pais} 
                onChange={(e) => { setPais(e.target.value); setDepartamento(""); }} 
                className="w-full rounded-lg border border-[#162E93]/50 bg-[#141233] px-3 py-2 text-white outline-none focus:border-[#2F2FE4]"
              >
                <option value="">Selecciona un país</option>
                {Object.keys(listaPaises).map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Selector de Departamento (Añadido por ti) */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-300">Departamento / Estado</label>
              <select 
                required 
                disabled={!pais} 
                value={departamento} 
                onChange={(e) => setDepartamento(e.target.value)} 
                className="w-full rounded-lg border border-[#162E93]/50 bg-[#141233] px-3 py-2 text-white outline-none focus:border-[#2F2FE4] disabled:opacity-40"
              >
                <option value="">Selecciona un departamento</option>
                {pais && listaPaises[pais].map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            
            <button type="submit" className="w-full bg-[#2F2FE4] py-2.5 rounded-lg font-semibold text-white transition hover:bg-[#162E93]">
              Aplicar
            </button>
          </form>

            </div>
          </div>
        )}

      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      <footer className="border-t border-[#162E93]/30 bg-[#080616] py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-xs text-slate-400 md:flex-row">
          <p>
            © {new Date().getFullYear()} <span className="font-semibold text-slate-200">Lumi Films</span>. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="transition hover:text-[#2F2FE4]">Privacidad</Link>
            <Link to="/terms" className="transition hover:text-[#2F2FE4]">Términos</Link>
            <Link to="/contact" className="transition hover:text-[#2F2FE4]">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
