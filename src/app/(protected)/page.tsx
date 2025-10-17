import AppHeader from "@/components/AppHeader";
import FavouriteLocationCard from "@/components/FavouriteLocationBanner/FavouriteLocationCard";
import HomepageCards from "@/components/HomepageCards";
import SignOutButton from "@/components/SignOutButton";

export default function Home() {
  return (
    <div className="relative min-h-screen px-4">
      {/* Header row */}
      <div className="flex justify-between items-center mt-4 mb-6">
        <AppHeader title="Weather App" />
        <SignOutButton />
      </div>

      <HomepageCards />
      <FavouriteLocationCard />
    </div>
  );
}
