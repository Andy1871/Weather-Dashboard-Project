"use client";

import SearchBar from "../SearchBar";
import TodayForecast from "../ui/TodayForecast";
import WeekForecast from "../ui/WeekForecast";

export default function FavouriteLocationCard() {
  return (
    <>
      <div className="mt-8 flex flex-row justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-200">
          Favourite Location
        </h2>
        <SearchBar placeholder="Choose favourite location" />
      </div>

      <div
        className="flex flex-col w-full bg-white/20 backdrop-blur-md text-white border border-white/30
rounded-xl shadow-sm mt-6"
      >
        <h3 className="ml-5 mt-5 mb-2 text-xl font-bold">Reading, UK</h3>
        <div>
          <TodayForecast />
          <WeekForecast />
        </div>
      </div>
    </>
  );
}
