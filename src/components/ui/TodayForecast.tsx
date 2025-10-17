// TodayForecast.tsx
import { format, isValid as isValidDate, fromUnixTime } from "date-fns";

interface TodayForecastItem {
  heading: string;
  info: string;
  subInfo?: string; // NEW
}

interface TodayForecastProps {
  dt?: number;
  data?: TodayForecastItem[];
}

function safeDateFromMaybeUnix(dt?: number) {
  if (typeof dt !== "number" || !Number.isFinite(dt)) return null;
  const date = dt > 1_000_000_000_000 ? new Date(dt) : fromUnixTime(dt);
  return isValidDate(date) ? date : null;
}

export default function TodayForecast({ dt, data }: TodayForecastProps) {
  const dateObj = safeDateFromMaybeUnix(dt);
  const now = dateObj ? format(dateObj, "EEE, do MMM") : "—";
  const items = Array.isArray(data) ? data : [];

  return (
    <div>
      <div className="flex items-baseline justify-between px-4">
        <h5 className="font-bold ml-1 mb-2">{now}</h5>
      </div>

      {items.length === 0 ? (
        <p className="ml-5 text-sm opacity-70">No forecast data.</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 px-4">
          {items.map((it, idx) => (
            <li
              key={idx}
              className="rounded-xl border border-[color:var(--border)]/100 bg-white/0 px-4 py-3 text-center"
            >
              <div className="text-sm opacity-80">{it.heading}</div>
              <div className="text-2xl font-bold leading-tight mt-1 text-white">
                {it.info}
              </div>
              {it.subInfo && (
                <div className="text-xs opacity-80 mt-0.5">{it.subInfo}</div>
              )}
            </li>
          ))}
        </ul>
      )}

      {!dateObj && (
        <p className="text-sm text-red-300 ml-5 mt-2">
          Invalid or missing date for this forecast.
        </p>
      )}
    </div>
  );
}
