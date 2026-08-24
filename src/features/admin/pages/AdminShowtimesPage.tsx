import { useEffect, useState } from "react";
import { Trash2, Edit3, AlertTriangle, X, ChevronDown, ChevronUp } from "lucide-react";
import { getShowtimes, createShowtime, updateShowtime, deleteShowtime } from "@/services/showtimes";
import { getMovies, type MovieRecord } from "@/services/movies";
import { getLocations, type CinemaLocation } from "@/services/locations";
import type { Showtime } from "@/features/billboard/types/billboard.types";

const FORMATS: Showtime["format"][] = ["2D", "3D", "IMAX", "4DX"];
const LANGUAGES: Showtime["language"][] = ["Español", "Inglés", "Subtitulada"];
const STATUSES: Showtime["status"][] = ["Estreno", "Próximamente"];

const emptyForm = {
    movieId: "",
    cinemaId: "",
    date: "",
    time: "",
    format: "2D" as Showtime["format"],
    language: "Español" as Showtime["language"],
    status: "Estreno" as Showtime["status"],
    isSoldOut: false,
};

export const AdminShowtimesPage = () => {
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [movies, setMovies] = useState<MovieRecord[]>([]);
    const [cinemas, setCinemas] = useState<(CinemaLocation & { cityName: string })[]>([]);
    const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [formData, setFormData] = useState(emptyForm);
    const [expandedMovies, setExpandedMovies] = useState<Set<string>>(new Set());
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        getShowtimes().then(setShowtimes).catch(console.error);
        getMovies().then(setMovies).catch(console.error);

        getLocations().then((countries) => {
            const allCinemas: (CinemaLocation & { cityName: string })[] = [];
            countries.forEach((country) => {
                country.departamentos.forEach((dept) => {
                    dept.ciudades.forEach((city) => {
                        city.cines.forEach((cinema) => {
                            allCinemas.push({ ...cinema, cityName: city.nombre });
                        });
                    });
                });
            });
            setCinemas(allCinemas);
        }).catch(console.error);
    }, []);

    const showtimesByMovie = movies.map((movie) => ({
        movie,
        showtimes: showtimes.filter((s) => s.movieId === movie.id),
    }));

    const toggleExpand = (movieId: string) => {
        setExpandedMovies((prev) => {
            const next = new Set(prev);
            next.has(movieId) ? next.delete(movieId) : next.add(movieId);
            return next;
        });
    };

    const getCinemaName = (cinemaId: string) => {
        return cinemas.find((c) => c.id === cinemaId)?.nombre ?? cinemaId;
    };

    const handleOpenEdit = (showtime: Showtime) => {
        setIsCreating(false);
        setEditingShowtime(showtime);
        setFormData({
            movieId: showtime.movieId,
            cinemaId: showtime.cinemaId,
            date: showtime.date,
            time: showtime.time,
            format: showtime.format,
            language: showtime.language,
            status: showtime.status,
            isSoldOut: showtime.isSoldOut,
        });
    };

    const handleOpenCreate = () => {
        setIsCreating(true);
        setEditingShowtime({} as Showtime);
        setFormData(emptyForm);
    };

    const fetchShowtimes = async () => {
        const data = await getShowtimes();
        setShowtimes(data);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEdit = Boolean(editingShowtime?.id);
        if (isEdit) {
            await updateShowtime(editingShowtime!.id, formData);
        } else {
            await createShowtime(formData);
            setExpandedMovies((prev) => new Set(prev).add(formData.movieId));
        }
        await fetchShowtimes();
        setEditingShowtime(null);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        await deleteShowtime(deletingId);
        await fetchShowtimes();
        setDeletingId(null);
    };

    const formatBadge = (format: Showtime["format"]) => {
        const colors: Record<Showtime["format"], string> = {
            "2D": "bg-slate-700 text-slate-200",
            "3D": "bg-blue-500/20 text-blue-300",
            "IMAX": "bg-purple-500/20 text-purple-300",
            "4DX": "bg-amber-500/20 text-amber-300",
        };
        return (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${colors[format]}`}>
                {format}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-white">Funciones</h1>
                    <p className="mt-1 text-sm text-slate-400">Administra las funciones registradas en el sistema</p>
                </div>

            </div>

            <div className="overflow-hidden rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/20">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="border-b border-[#162E93]/40 bg-[#080616]/60 text-xs uppercase text-slate-400">
                        <tr>
                            <th className="px-6 py-4">Película</th>
                            <th className="px-6 py-4">Funciones</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#162E93]/20">
                        {showtimesByMovie.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                                    No hay funciones registradas.
                                </td>
                            </tr>
                        ) : (
                            showtimesByMovie.map(({ movie, showtimes: movieShowtimes }) => {
                                const isExpanded = expandedMovies.has(movie.id);
                                return (
                                    <>
                                        <tr
                                            key={movie.id}
                                            className="cursor-pointer transition hover:bg-[#1A1953]/40"
                                            onClick={() => toggleExpand(movie.id)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={movie.poster} alt={movie.title} className="h-10 w-7 rounded object-cover" />
                                                    <span className="font-semibold text-white">{movie.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {movieShowtimes.slice(0, 3).map((s) => (
                                                        <span key={s.id} className="flex items-center gap-1 rounded-lg bg-[#162E93]/40 px-2 py-1 text-[10px] text-slate-300">
                                                            {s.time} {formatBadge(s.format)}
                                                        </span>
                                                    ))}
                                                    {movieShowtimes.length > 3 && (
                                                        <span className="rounded-lg bg-[#1A1953] px-2 py-1 text-[10px] text-slate-400">
                                                            +{movieShowtimes.length - 3} más
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="rounded-lg p-2 text-slate-400 hover:text-white transition">
                                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </button>
                                            </td>
                                        </tr>

                                        {isExpanded && (
                                            <>
                                                {movieShowtimes.map((showtime) => (
                                                    <tr key={showtime.id} className="bg-[#080616]/40 transition hover:bg-[#1A1953]/30">
                                                        <td className="py-3 pl-16 pr-6 text-xs text-slate-400">
                                                            {getCinemaName(showtime.cinemaId)}
                                                            <span className="ml-2 text-slate-600">· {showtime.date}</span>
                                                        </td>
                                                        <td className="px-6 py-3">
                                                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                                                <span className="font-medium text-white">{showtime.time}</span>
                                                                {formatBadge(showtime.format)}
                                                                <span className="text-slate-400">{showtime.language}</span>
                                                                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${showtime.isSoldOut ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                                                                    {showtime.isSoldOut ? "Agotado" : showtime.status}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-3 text-right space-x-1">
                                                            <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(showtime); }} className="rounded-lg p-2 text-blue-400 hover:bg-blue-500/10" title="Editar">
                                                                <Edit3 size={14} />
                                                            </button>
                                                            <button onClick={(e) => { e.stopPropagation(); setDeletingId(showtime.id); }} className="rounded-lg p-2 text-rose-400 hover:bg-rose-500/10" title="Eliminar">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}

                 
                                                <tr className="bg-[#080616]/40">
                                                    <td colSpan={3} className="px-6 py-3 pl-16">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsCreating(true);
                                                                setEditingShowtime({} as Showtime);
                                                                setFormData({ ...emptyForm, movieId: movie.id });
                                                            }}
                                                            className="flex items-center gap-1.5 text-xs text-[#8E8EFF] hover:text-white transition"
                                                        >
                                                            <span className="text-lg leading-none">+</span> Agregar función
                                                        </button>
                                                    </td>
                                                </tr>
                                            </>
                                        )}
                                    </>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {deletingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-[#080616] p-6 text-center shadow-2xl">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-500">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">¿Confirmas la eliminación?</h3>
                        <p className="mt-2 text-xs text-slate-400">Esta acción eliminará la función permanentemente del sistema.</p>
                        <div className="mt-6 flex justify-center gap-3">
                            <button onClick={() => setDeletingId(null)} className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">Cancelar</button>
                            <button onClick={confirmDelete} className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700">Sí, eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {editingShowtime && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl border border-[#162E93] bg-[#080616] p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">
                                {isCreating ? "Nueva Función" : "Editar Función"}
                            </h2>
                            <button onClick={() => setEditingShowtime(null)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-3">

                            {isCreating && (
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Película</label>
                                    <select
                                        required
                                        value={formData.movieId}
                                        onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                                        className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]"
                                    >
                                        <option value="">Selecciona una película</option>
                                        {movies.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Cine</label>
                                <select
                                    required
                                    value={formData.cinemaId}
                                    onChange={(e) => setFormData({ ...formData, cinemaId: e.target.value })}
                                    className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]"
                                >
                                    <option value="">Selecciona un cine</option>
                                    {cinemas.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nombre} — {c.cityName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Fecha</label>
                                    <input required type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Hora</label>
                                    <input required type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Formato</label>
                                    <select value={formData.format} onChange={(e) => setFormData({ ...formData, format: e.target.value as Showtime["format"] })} className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]">
                                        {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Idioma</label>
                                    <select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value as Showtime["language"] })} className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]">
                                        {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Estado</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as Showtime["status"] })} className="w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]">
                                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 pt-5">
                                    <input type="checkbox" id="isSoldOut" checked={formData.isSoldOut} onChange={(e) => setFormData({ ...formData, isSoldOut: e.target.checked })} className="h-4 w-4 rounded accent-[#2F2FE4]" />
                                    <label htmlFor="isSoldOut" className="text-xs text-slate-300">Agotado</label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setEditingShowtime(null)} className="rounded-xl px-4 py-2 text-xs text-slate-400 hover:text-white">Cancelar</button>
                                <button type="submit" className="rounded-xl bg-[#2F2FE4] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#162E93]">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};