import { Card, CardTitle, CardContent } from "../ui/card";

const todaysWeather = [
  { heading: "Temperature", info: "30 degrees" },
  { heading: "Rain", info: "0mm" },
  { heading: "Wind Speed", info: "10mph" },
  { heading: "Visibility", info: "Very clear" },
  { heading: "UV Index", info: "9" },
];

export default function FavouriteLocationToday() {
  return (
    <div>
      <h5 className="font-bold ml-5 mb-2">Friday, 23rd August</h5>
      <div className="flex gap-4 flex-row justify-between px-4">
        {todaysWeather.map((today, index) => (
          <Card
            key={index}
            className="w-full flex flex-col h-30 justify-center text-center bg-slate-300  text-slate-800 shadow-none border-"
          >
              <CardTitle className="text-lg">
                {today.heading}
              </CardTitle>
            <CardContent className="p-0 mt-0 text-lg font-bold">
              <p>{today.info}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
