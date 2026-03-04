interface WeekForecastProps {
  data?: { name: string; low: string; high: string; pop?: number }[];
}

export default function WeekForecast({ data }: WeekForecastProps) {
  const items = Array.isArray(data) ? data : [];

  return (
    <div className="px-4 pt-2 pb-3">
      <div className="flex items-center gap-2 mb-2.5">
        <h5 className="text-[10px] font-semibold tracking-widest uppercase opacity-45">
          Rest of the Week
        </h5>
      </div>

      {items.length === 0 ? (
        <p className="text-xs opacity-70">No weekly data.</p>
      ) : (
        <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-1.5">
          {items.map((day, idx) => {
            const popPct =
              typeof day.pop === "number" ? Math.round(day.pop * 100) : null;

            return (
              <li
                key={idx}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2 text-center"
              >
                <div className="text-[10px] font-semibold tracking-wide uppercase opacity-45 mb-1">
                  {day.name}
                </div>

                <div className="text-sm leading-tight">
                  <span className="font-semibold text-white">{day.high}</span>
                  <span className="text-white/40 mx-0.5">·</span>
                  <span className="text-white/50 text-xs">{day.low}</span>
                </div>

                <div className="mt-1.5 flex items-center justify-center gap-0.5 opacity-50">
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="w-2.5 h-2.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2C9 6 6 9.5 6 13a6 6 0 1 0 12 0c0-3.5-3-7-6-11z" />
                  </svg>
                  <span className="text-[10px]">
                    {popPct !== null ? `${popPct}%` : "—"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
