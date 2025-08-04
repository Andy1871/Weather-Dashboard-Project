import { Card, CardTitle, CardContent } from "../ui/card";

interface WeekForecastProps {
  data: { name: string; low: string; high: string }[];
}

export default function WeekForecast({ data }: WeekForecastProps) {
  return (
    <div className="mt-5">
      <h5 className="font-bold ml-5 mb-2">Rest of the Week</h5>
      <div className="flex gap-4 flex-row justify-between px-4 mb-6">
        {data.map((day, index) => (
          <Card
            key={index}
            className="w-full flex flex-col justify-center text-center bg-slate-300  text-slate-800 shadow-none border-"
          >
            <CardTitle className="text-lg">{day.name}</CardTitle>
            <CardContent className="p-0 mt-0">
                <p className="text-lg font-bold">{day.high}</p>
              <p>
                {day.low} - {day.high}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}