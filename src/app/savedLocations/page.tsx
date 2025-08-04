"use client";

import { useState } from "react";
import SavedLocationCard from "@/components/saved/SavedLocationCard";
import SearchBar from "@/components/SearchBar";
import { AddLocationModal } from "@/components/saved/modal/AddLocationModal";
import { allLocationsData } from "@/data/AllLocations";

export default function SavedLocations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [savedLocations, setSavedLocations] = useState<string[]>([]);

  const handleAddLocation = (locationName: string) => {
    if (!savedLocations.includes(locationName)) {
      setSavedLocations([...savedLocations, locationName]);
    }
  };

  const filteredLocations = savedLocations.filter((location) =>
    location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative px-4">
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-200">
        Saved Locations
      </h1>
      <div className="mt-10 relative w-full h-16">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-sm">
          <SearchBar
            placeholder="Search your saved locations"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="absolute right-0">
          <AddLocationModal onAddLocation={handleAddLocation} />
        </div>
      </div>

      {filteredLocations.map((locationName) => {
        const locationData = allLocationsData.find(
          (loc) => loc.name === locationName
        );
        return (
          locationData && (
            <SavedLocationCard
              key={locationName}
              location={locationData.name}
              todayForecast={locationData.todayForecast}
              weekForecast={locationData.weekForecast}
            />
          )
        );
      })}
    </div>
  );
}
