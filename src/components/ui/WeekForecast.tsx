import { Card, CardTitle, CardContent } from "../ui/card";

interface WeekForecastProps {
  data?: { name: string; low: string; high: string }[];
}

export default function WeekForecast({ data }: WeekForecastProps) {
  const items = Array.isArray(data) ? data : [];

  return (
    <div className="mt-5">
      <h5 className="font-bold ml-5 mb-2">Rest of the Week</h5>

      {items.length === 0 ? (
        <p className="ml-5 mb-6 text-sm opacity-70">No weekly data.</p>
      ) : (
        <div className="flex gap-4 flex-row justify-between px-4 mb-6">
          {items.map((day, index) => (
            <Card
              key={index}
              className="w-full flex flex-col items-center justify-center text-center bg-slate-300 text-slate-800 shadow-none min-h-35"
            >
              <CardTitle className="text-lg">{day.name}</CardTitle>

              <CardContent className="flex flex-col items-center justify-center flex-1">
                <p className="-mt-4 mb-3 text-2xl font-bold">{day.high}</p>
                <p className="text-sm opacity-80">
                  {day.low} - {day.high}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
