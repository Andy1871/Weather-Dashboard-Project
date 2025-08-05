"use client";

import TodayForecast from "../ui/TodayForecast";
import WeekForecast from "../ui/WeekForecast";
import { ButtonWithRemove } from "../ui/remove";

interface SavedLocationCardProps {
  location: string;
  todayForecast: { heading: string; info: string }[];
  weekForecast: { name: string; low: string; high: string }[];
  onRemove: () => void;
}

export default function SavedLocationCard({
  location,
  todayForecast,
  weekForecast,
  onRemove,
}: SavedLocationCardProps) {
  return (
    <div
      className="flex flex-col w-full bg-white/20 backdrop-blur-md text-white border border-white/30
rounded-xl shadow-sm mb-6"
    >
      <div className="flex justify-between items-center px-5 pt-5">
        <h3 className="mt-5 mb-2 text-xl font-bold">{location}</h3>
        <ButtonWithRemove onClick={onRemove} />
      </div>
      <div>
        <TodayForecast data={todayForecast} />
        <WeekForecast data={weekForecast} />
      </div>
    </div>
  );
}
