import { format, isValid as isValidDate, fromUnixTime } from "date-fns";

interface TodayForecastItem {
  heading: string;
  info: string;
  subInfo?: string;
}

interface TodayForecastProps {
  dt?: number;
  data?: TodayForecastItem[];
}

function safeDateFromMaybeUnix(dt?: number) {
  if (typeof dt !== "number" || !Number.isFinite(dt)) return null;
  // if dt is ms or s
  const date = dt > 1_000_000_000_000 ? new Date(dt) : fromUnixTime(dt);
  return isValidDate(date) ? date : null;
}

export default function TodayForecast({ dt, data }: TodayForecastProps) {
  const dateObj = safeDateFromMaybeUnix(dt);
  const now = dateObj ? format(dateObj, "EEE, do MMM") : "—";
  const items = Array.isArray(data) ? data : [];

  return (
    <div>
      
        <h5 className="font-semibold ml-5 mb-1 text-sm tracking-wide opacity-90">
          {now}
        </h5>
      

      {items.length === 0 ? (
        <p className="ml-5 text-xs opacity-70">No forecast data.</p>
      ) : (
        <ul className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 px-4">
          {items.map((it, idx) => (
            <li
              key={idx}
              className="rounded-lg border border-[color:var(--border)]/100 bg-white/0 px-3 py-2.5 text-center"
            >
              <div className="text-xs font-medium opacity-80">{it.heading}</div>

              <div className="text-xl font-semibold leading-tight mt-0.5 text-white">
                {it.info}
              </div>

              {it.subInfo && (
                <div className="text-[11px] opacity-75 mt-0.5">
                  {it.subInfo}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {!dateObj && (
        <p className="text-xs text-red-300 ml-5 mt-1.5">
          Invalid or missing date for this forecast.
        </p>
      )}
    </div>
  );
}
