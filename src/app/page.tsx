import AppHeader from "@/components/AppHeader";
import FavouriteLocationCard from "@/components/FavouriteLocationBanner/FavouriteLocationCard";
import HomepageCards from "@/components/HomepageCards";

// Where we add each component, build UI here.
export default function Home() {
  return (
    <div>
      <AppHeader title="Weather App" />
      <HomepageCards />
      <FavouriteLocationCard />
    </div>
  );
}
