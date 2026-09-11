import type { MovieFormValues } from "../../types/admin.types";

interface MovieFormModalProps {
  isEdit: boolean;
  formData: MovieFormValues;
  onChange: (values: MovieFormValues) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const RATING_OPTIONS = ["G", "PG", "PG-13", "R"];

const inputClass =
  "w-full rounded-xl border border-[#162E93] bg-[#1A1953]/50 p-2 text-xs text-white outline-none focus:border-[#2F2FE4]";

export const MovieFormModal = ({ isEdit, formData, onChange, onSubmit, onCancel }: MovieFormModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[#162E93] bg-[#080616] p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-4">
          {isEdit ? "Editar Película" : "Nueva Película"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Título</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => onChange({ ...formData, title: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Director</label>
            <input
              required
              type="text"
              value={formData.director}
              onChange={(e) => onChange({ ...formData, director: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">URL del póster</label>
            <input
              required
              type="url"
              value={formData.poster}
              onChange={(e) => onChange({ ...formData, poster: e.target.value })}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">URL del tráiler</label>
            <input
              type="url"
              value={formData.trailer}
              onChange={(e) => onChange({ ...formData, trailer: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Género</label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => onChange({ ...formData, genre: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Puntaje</label>
              <input
                type="number"
                step="0.1"
                min={0}
                max={10}
                value={formData.score}
                onChange={(e) => onChange({ ...formData, score: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Clasificación</label>
              <select
                value={formData.rating}
                onChange={(e) => onChange({ ...formData, rating: e.target.value })}
                className={inputClass}
              >
                {RATING_OPTIONS.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Duración (min)</label>
              <input
                required
                type="number"
                min={1}
                value={formData.duration}
                onChange={(e) => onChange({ ...formData, duration: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button type="submit" className="rounded-xl bg-[#2F2FE4] px-4 py-2 text-xs font-semibold text-white">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
