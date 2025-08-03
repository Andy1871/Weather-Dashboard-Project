import FavouriteLocationToday from "./FavouriteLocationToday"
import FavouriteLocationWeekForecast from "./FavouriteLocationWeekForecast";

export default function FavouriteLocationCard() {
  return (
    <div className="flex flex-col w-full bg-slate-300 rounded-xl shadow-sm mt-6">
      <h3 className="ml-5 mt-5 mb-2 text-xl font-bold">Reading, UK</h3>
      <div>
        <FavouriteLocationToday />
        <FavouriteLocationWeekForecast />
      </div>
    </div>
  );
}
