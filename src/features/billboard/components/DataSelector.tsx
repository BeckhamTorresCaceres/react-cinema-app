// Selector de 7 días

interface DateSelectorProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

export  const DateSelector = ({ selectedDate, onSelectDate }: DateSelectorProps) => {
  // Generar los próximos 7 días a partir de hoy
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      fullDate: d.toISOString().split("T")[0],
      dayName: d.toLocaleDateString("es-ES", { weekday: "short" }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString("es-ES", { month: "short" }),
    };
  });

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
      {days.map((item) => {
        const isSelected = selectedDate === item.fullDate;
        return (
          <button
            key={item.fullDate}
            onClick={() => onSelectDate(item.fullDate)}
            className={`flex min-w-[21.25] flex-col items-center justify-center rounded-xl p-3 transition duration-200 ${
              isSelected
                ? "bg-[#2F2FE4] text-white shadow-lg shadow-[#2F2FE4]/40"
                : "border border-[#162E93]/40 bg-[#1A1953]/50 text-slate-300 hover:border-[#2F2FE4]"
            }`}
          >
            <span className="text-xs uppercase tracking-wider font-medium opacity-80">
              {item.dayName}
            </span>
            <span className="text-xl font-extrabold my-0.5">{item.dayNumber}</span>
            <span className="text-[10px] uppercase font-semibold">{item.monthName}</span>
          </button>
        );
      })}
    </div>
  );
};