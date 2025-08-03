import FavouriteLocationCard from "@/components/FavouriteLocationBanner/FavouriteLocationCard";
import HomepageCards from "@/components/HomepageCards";

// Where we add each component, build UI here.
export default function Home() {
  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900">Weather App</h1>
      <HomepageCards />
      <FavouriteLocationCard />
    </div>
  );
}
