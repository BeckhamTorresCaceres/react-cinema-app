export const HeroStatsBar = () => {
  const stats = [
    { value: "12", label: "Salas Dolby Atmos" },
    { value: "4K", label: "Proyección HDR" },
    { value: "40+", label: "Títulos en cartelera" },
    { value: "IMAX", label: "Experiencia Inmersiva" },
  ];

  return (
    <div className="border-y border-[#162E93]/40 bg-[#0A071E]/80 py-4 px-6 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-around gap-6 text-center">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <span className="text-xl font-bold text-amber-400">{stat.value}</span>
            <span className="text-xs uppercase tracking-wider text-slate-400">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
