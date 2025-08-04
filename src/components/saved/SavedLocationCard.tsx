"use client";

import TodayForecast from "../ui/TodayForecast";
import WeekForecast from "../ui/WeekForecast";

interface SavedLocationCardProps {
  location: string;
  todayForecast: { heading: string; info: string }[];
  weekForecast: { name: string; low: string; high: string }[];
}

export default function SavedLocationCard({
  location,
  todayForecast,
  weekForecast
}: SavedLocationCardProps) {
  return (
    <div
      className="flex flex-col w-full bg-white/20 backdrop-blur-md text-white border border-white/30
rounded-xl shadow-sm mb-6"
    >
      <h3 className="ml-5 mt-5 mb-2 text-xl font-bold">{location}</h3>
      <div>
        <TodayForecast data={todayForecast} />
        <WeekForecast data={weekForecast} />
      </div>
    </div>
  );
}
