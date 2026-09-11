import { useEffect, useState } from "react";
import { MapPin, X } from "lucide-react";
import { getLocations } from "../services/locationService";
import type { CountryLocation } from "../types/location.types";
import { readSelectedLocation, saveSelectedLocation } from "../hooks/useSelectedLocation";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelected?: () => void;
  required?: boolean;
}

export const LocationModal = ({ isOpen, onClose, onLocationSelected, required = false }: LocationModalProps) => {
  const [country, setCountry] = useState(() => readSelectedLocation().country);
  const [region, setRegion] = useState(() => readSelectedLocation().department);
  const [city, setCity] = useState(() => readSelectedLocation().city);
  const [shaking, setShaking] = useState(false);
  const [locations, setLocations] = useState<CountryLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || locations.length) return;

    let isMounted = true;
    queueMicrotask(() => {
      if (!isMounted) return;
      setIsLoading(true);
      setError("");
    });

    getLocations()
      .then((data) => {
        if (isMounted) setLocations(data);
      })
      .catch(() => {
        if (isMounted) setError("No pudimos cargar las ubicaciones. Inténtalo nuevamente.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [isOpen, locations.length]);

  const selectedCountry = locations.find((item) => item.nombre === country);
  const selectedDepartment = selectedCountry?.departamentos.find((item) => item.nombre === region);

  if (!isOpen) return null;

  const close = () => {
    setShaking(false);
    const saved = readSelectedLocation();
    setCountry(saved.country);
    setRegion(saved.department);
    setCity(saved.city);
    onClose();
  };
  const apply = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!country || !region || !city) { setShaking(true); return; }
    saveSelectedLocation({ country, department: region, city });
    onLocationSelected?.();
    close();
  };

  return (
    <div className={`modal-overlay-enter fixed inset-0 z-50 flex items-center justify-center p-4 ${required ? "bg-[#080616]" : "bg-black/70 backdrop-blur-sm"}`} role="dialog" aria-modal="true" aria-labelledby="location-title">
      <div className={shaking ? "modal-shake w-full max-w-md" : "w-full max-w-md"} onAnimationEnd={() => setShaking(false)}>
        <div className="relative rounded-2xl border border-[#6D5CFF]/60 bg-[#0A071E] p-[1px] shadow-[0_0_30px_rgba(109,92,255,0.45)]">
          <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(109,92,255,0.35),_transparent_55%)]" />
          <div className="relative w-full rounded-2xl bg-[#0A071E] p-6 shadow-2xl modal-content-enter">
            {!required && <button type="button" onClick={close} className="absolute right-4 top-4 cursor-pointer text-slate-400 hover:text-white" aria-label="Cerrar selector de ubicación"><X size={20} /></button>}
            <div className="mb-6 flex items-center gap-3"><MapPin size={24} className="text-[#8E8EFF]" /><div><h3 id="location-title" className="text-xl font-bold">Selecciona tu ubicación</h3><p className="text-xs text-slate-400">{required ? "Es necesaria para continuar y ver la cartelera." : "Selecciona tu región para ver la cartelera local"}</p></div></div>
            <form onSubmit={apply} noValidate className="space-y-4">
              <LocationSelect label="País" value={country} disabled={isLoading} onChange={(value) => { setCountry(value); setRegion(""); setCity(""); }}><option value="">Selecciona un país</option>{locations.map((item) => <option key={item.id} value={item.nombre}>{item.nombre}</option>)}</LocationSelect>
              <LocationSelect label="Departamento / Estado" value={region} disabled={!selectedCountry || isLoading} onChange={(value) => { setRegion(value); setCity(""); }}><option value="">Selecciona un departamento</option>{selectedCountry?.departamentos.map((item) => <option key={item.id} value={item.nombre}>{item.nombre}</option>)}</LocationSelect>
              <LocationSelect label="Ciudad" value={city} disabled={!selectedDepartment || isLoading} onChange={setCity}><option value="">Selecciona una ciudad</option>{selectedDepartment?.ciudades.map((item) => <option key={item.id} value={item.nombre}>{item.nombre}</option>)}</LocationSelect>
              {isLoading && <p className="text-xs text-slate-400">Cargando ubicaciones...</p>}
              {error && <p className="text-xs text-red-400" role="alert">{error}</p>}
              <button type="submit" disabled={isLoading || Boolean(error)} className="w-full cursor-pointer rounded-lg bg-[#2F2FE4] py-2.5 font-semibold text-white transition hover:bg-[#162E93] disabled:cursor-not-allowed disabled:opacity-50">Aplicar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LocationSelectProps { label: string; value: string; disabled?: boolean; onChange: (value: string) => void; children: React.ReactNode; }
const LocationSelect = ({ label, value, disabled = false, onChange, children }: LocationSelectProps) => (
  <label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">{label}<select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-[#162E93]/50 bg-[#141233] px-3 py-2 text-white outline-none focus:border-[#2F2FE4] disabled:opacity-40">{children}</select></label>
);
