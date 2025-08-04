import { Card, CardTitle, CardContent } from "../ui/card";

interface TodayForecastProps {
  data: { heading: string; info: string }[];
}

export default function TodayForecast({ data }: TodayForecastProps) {
  return (
    <div>
      <h5 className="font-bold ml-5 mb-2">Friday, 23rd August</h5>
      <div className="flex gap-4 flex-row justify-between px-4">
        {data.map((today, index) => (
          <Card
            key={index}
            className="gap-2 w-full flex flex-col h-30 justify-center text-center bg-slate-300  text-slate-800 shadow-none border-"
          >
            <CardTitle className="text-lg">{today.heading}</CardTitle>
            <CardContent className="p-0 mt-0 text-2xl font-bold">
              <p>{today.info}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
