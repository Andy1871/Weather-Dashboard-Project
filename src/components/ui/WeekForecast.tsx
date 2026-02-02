interface WeekForecastProps {
  data?: { name: string; low: string; high: string; pop?: number }[];
}

export default function WeekForecast({ data }: WeekForecastProps) {
  const items = Array.isArray(data) ? data : [];

  return (
    <div>
  <h5 className="font-semibold ml-5 mb-1 text-sm tracking-wide opacity-90">
    Rest of the Week
  </h5>

  {items.length === 0 ? (
    <p className="ml-5 text-xs opacity-70">No weekly data.</p>
  ) : (
    
      <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 px-4">
        {items.map((day, idx) => {
          const popPct =
            typeof day.pop === "number" ? Math.round(day.pop * 100) : null;

          return (
            <li
              key={idx}
              className="rounded-lg border border-[color:var(--border)]/100 bg-white/0 px-3 py-2.5 text-center"
            >
              <div className="text-xs font-medium opacity-80">
                {day.name}
              </div>

              <div className="mt-0.5 text-lg font-semibold leading-tight text-white">
                {day.low} – {day.high}
              </div>

              <div className="mt-1.5 text-[11px] opacity-80 flex items-center justify-center gap-1">
                <span>{popPct !== null ? `${popPct}%` : "—"}</span>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="w-3 h-3 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2C9 6 6 9.5 6 13a6 6 0 1 0 12 0c0-3.5-3-7-6-11z" />
                </svg>
              </div>
            </li>
          );
        })}
      </ul>

  )}
</div>
  );
}
