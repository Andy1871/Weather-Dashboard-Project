"use client";

import { useMemo, useState } from "react";
import SavedLocationCardContainer from "@/components/saved/SavedLocationCardContainer";
import SearchBar from "@/components/SearchBar";
import { AddLocationModal } from "@/components/saved/modal/AddLocationModal";
import AppHeader from "@/components/AppHeader";

type SavedLocation = {
  id: string;
  displayName: string;
  lat: number;
  lon: number;
};

type SearchResult = {
  id: string;
  displayName: string;
  lat: number;
  lon: number;
};

export default function SavedLocations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);

  const handleAddLocation = (r: SearchResult) => {
    setSavedLocations((prev) =>
      prev.some((s) => s.id === r.id)
        ? prev
        : [
            ...prev,
            { id: r.id, displayName: r.displayName, lat: r.lat, lon: r.lon },
          ]
    );
  };

  const handleRemoveLocation = (id: string) => {
    setSavedLocations((prev) => prev.filter((l) => l.id !== id));
  };

  // filter by display name ONLY (this is your "filter not search" bar)
  const filtered = useMemo(
    () =>
      savedLocations.filter((l) =>
        l.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [savedLocations, searchTerm]
  );

  return (
    <div className="relative px-4">
      <AppHeader title="Saved Locations" />

      <div className="mt-10 relative w-full h-16">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-sm">
          <SearchBar
            placeholder="Search your saved locations"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="absolute right-0">
          <AddLocationModal
            onAddLocation={handleAddLocation}
            savedLocations={savedLocations.map((s) => s.displayName)}
          />
        </div>
      </div>

      {/* Render a card container that fetches forecast per saved item */}
      {filtered.map((loc) => (
        <SavedLocationCardContainer
          key={loc.id}
          id={loc.id}
          title={loc.displayName}
          lat={loc.lat}
          lon={loc.lon}
          onRemove={() => handleRemoveLocation(loc.id)}
        />
      ))}
    </div>
  );
}
