"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { CountryWeather, LiveWeatherByCapital } from "@/types/weather";

export interface CountryCardsProps {
  countries: CountryWeather[];
  liveWeatherByCapital: LiveWeatherByCapital;
}

function keyFromCapital(capital: string) {
  return capital.trim().toLowerCase();
}

export default function CountryCards({
  countries,
  liveWeatherByCapital,
}: CountryCardsProps) {
  const withLive = countries.filter(
    (c) => !!liveWeatherByCapital[keyFromCapital(c.capital)]
  );

  return (
    <div className="grid grid-cols-1 gap-5 py-5 items-stretch sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {withLive.map((c) => {
        const live = liveWeatherByCapital[keyFromCapital(c.capital)];

        const now = Math.round(live!.temp);
        const hi = Math.round(live!.high);
        const lo = Math.round(live!.low);

        return (
          <Card
            key={`${c.country}-${c.capital}`}
            className="h-full flex flex-col justify-between bg-white/20 backdrop-blur-md text-white border border-white/30"
          >
            <CardHeader>
              <CardTitle className="flex flex-col">
                <span className="text-2xl font-bold">{c.capital}</span>
                <span className="text-sm">{c.country}</span>
                <span className="text-sm font-normal">13:00</span>
              </CardTitle>

              <CardDescription className="pt-3.5 text-center text-6xl font-bold text-gray-200">
                {now}°
              </CardDescription>
            </CardHeader>

            <CardFooter className="mx-auto flex flex-col gap-2">
              <span className="text-xl">
                {lo}° — {hi}°
              </span>
              <span className="text-center">Rain expected. Mostly sunny.</span>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
