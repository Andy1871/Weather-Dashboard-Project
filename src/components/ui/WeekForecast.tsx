interface WeekForecastProps {
  data?: { name: string; low: string; high: string; pop?: number }[];
}

export default function WeekForecast({ data }: WeekForecastProps) {
  const items = Array.isArray(data) ? data : [];

  return (
    <div className="mt-6">
      <h5 className="font-bold ml-5 mb-2">Rest of the Week</h5>

      {items.length === 0 ? (
        <p className="ml-5 mb-6 text-sm opacity-70">No weekly data.</p>
      ) : (
        <div className="px-4">
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {items.map((day, idx) => {
              const popPct =
                typeof day.pop === "number" ? Math.round(day.pop * 100) : null;
              return (
                <li
                  key={idx}
                  className="rounded-xl border border-[color:var(--border)]/100 bg-white/0 px-4 py-3 text-center"
                >
                  <div className="text-sm opacity-80">{day.name}</div>

                  
                  <div className="mt-1 text-xl font-bold leading-tight text-white">
                    {day.low} - {day.high}
                  </div>

                  
                  <div className="mt-2 text-xs opacity-85 flex items-center justify-center gap-1">
                    <span>{popPct !== null ? `${popPct}%` : "—"}</span>
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 text-white/80"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {/* Rain droplet icon */}
                      <path d="M12 2C9 6 6 9.5 6 13a6 6 0 1 0 12 0c0-3.5-3-7-6-11z" />
                    </svg>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
