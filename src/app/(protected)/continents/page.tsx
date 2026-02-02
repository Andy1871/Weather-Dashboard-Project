import AppHeader from "@/components/AppHeader";
import ContinentsCards from "@/components/continents/ContinentsCards";



export default function Continents() {
  return (
    <div>
      <AppHeader title="Continents" />
      <p className=" text-gray-200 mt-6 mb-2">Click a continent card below to view the basic weather of all capital cities, sorted by their countries.</p>
        <ContinentsCards />

    </div>
  );
}
