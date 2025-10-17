"use client";

import { useMemo, useState } from "react";
import SavedLocationCardContainer from "@/components/saved/SavedLocationCardContainer";
import SearchBar from "@/components/SearchBar";
import { AddLocationModal } from "@/components/saved/modal/AddLocationModal";
import AppHeader from "@/components/AppHeader";
import { addLocation, removeLocation } from "@/app/actions/savedLocations";

type Row = {
  location_id: string;
  display_name: string;
  lat: number;
  lon: number;
  is_favorite?: boolean;
};

type SearchResult = {
  id: string;
  displayName: string;
  lat: number;
  lon: number;
};

export default function SavedLocations({ initial = [] as Row[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [saved, setSaved] = useState<Row[]>(initial);

  const handleAddLocation = async (r: SearchResult) => {
    // optimistic add
    setSaved((prev) =>
      prev.some((s) => s.location_id === r.id)
        ? prev
        : [...prev, { location_id: r.id, display_name: r.displayName, lat: r.lat, lon: r.lon }]
    );

    try {
      await addLocation({
        location_id: r.id,
        display_name: r.displayName,
        lat: r.lat,
        lon: r.lon,
      });
    } catch {
      // roll back if needed
      setSaved((prev) => prev.filter((s) => s.location_id !== r.id));
    }
  };

  const handleRemoveLocation = async (location_id: string) => {
    // optimistic remove
    const before = saved;
    setSaved((prev) => prev.filter((l) => l.location_id !== location_id));
    try {
      await removeLocation(location_id);
    } catch {
      setSaved(before); // rollback on error
    }
  };

  const filtered = useMemo(
    () =>
      saved.filter((l) =>
        l.display_name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [saved, searchTerm]
  );

  return (
    <div className="relative px-4">
      <AppHeader title="Saved Locations" />

      <div className="mt-10 w-full flex flex-col-reverse items-center gap-4 md:flex-row md:justify-between md:items-center md:gap-6 mb-6 md:mb-4">
        <div className="w-full max-w-sm">
          <SearchBar
            placeholder="Search your saved locations"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <AddLocationModal
          onAddLocation={handleAddLocation}
          savedLocations={saved.map((s) => s.display_name)}
        />
      </div>

      <div className="mt-4 md:mt-2 space-y-6">
        {filtered.map((loc) => (
          <SavedLocationCardContainer
            key={loc.location_id}
            id={loc.location_id}
            title={loc.display_name}
            lat={loc.lat}
            lon={loc.lon}
            onRemove={() => handleRemoveLocation(loc.location_id)}
          />
        ))}
      </div>
    </div>
  );
}
