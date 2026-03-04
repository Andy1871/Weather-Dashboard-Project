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
    <div className="px-4 pt-3 pb-1">
      <div className="flex items-center gap-2 mb-2.5">
        <h5 className="text-[10px] font-semibold tracking-widest uppercase opacity-45">
          Today
        </h5>
        <span className="text-[10px] opacity-30">·</span>
        <span className="text-[10px] opacity-45">{now}</span>
      </div>

      {items.length === 0 ? (
        <p className="text-xs opacity-70">No forecast data.</p>
      ) : (
        <ul className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
          {items.map((it, idx) => (
            <li
              key={idx}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2 text-center"
            >
              <div className="text-[10px] font-medium tracking-wide uppercase opacity-45 mb-1">
                {it.heading}
              </div>
              <div className="text-lg font-semibold leading-none text-white">
                {it.info}
              </div>
              {it.subInfo && (
                <div className="text-[10px] opacity-40 mt-1 leading-tight">
                  {it.subInfo}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {!dateObj && (
        <p className="text-xs text-red-300 mt-1.5">
          Invalid or missing date for this forecast.
        </p>
      )}
    </div>
  );
}
