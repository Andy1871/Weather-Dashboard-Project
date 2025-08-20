import { Card, CardTitle, CardContent } from "../ui/card";
import { format, isValid as isValidDate, fromUnixTime } from "date-fns";

interface TodayForecastProps {
  dt?: number;
  data?: { heading: string; info: string }[]; // this is taken from AllLocations.
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
      <h5 className="font-bold ml-5 mb-2">{now}</h5>

      {items.length === 0 ? (
        <p className="ml-5 text-sm opacity-70">No forecast data.</p>
      ) : (
        <div className="flex gap-4 flex-row justify-between px-4">
          {items.map((today, index) => (
            <Card
              key={index}
              className="gap-2 w-full flex flex-col h-30 justify-center text-center bg-slate-300  text-slate-800 shadow-none min-h-35"
            >
              <CardTitle className="text-lg">{today.heading}</CardTitle>
              <CardContent className="p-0 mt-0 text-2xl font-bold">
                <p className="pl-1 pr-1">{today.info}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!dateObj && (
        <p className="text-sm text-red-600 ml-5 mt-2">
          Invalid or missing date for this forecast.
        </p>
      )}
    </div>
  );
}
