// SearchedLocations.tsx
import { ButtonWithIcon } from "@/components/ui/add";

type SearchResult = {
  id: string;
  name: string;
  state: string | null;
  country: string;       // now already the full name (see modal changes)
  lat: number;
  lon: number;
  displayName: string;   // "City, State, Country (full)"
};

interface SearchedLocationsProps {
  locations: SearchResult[];
  loading?: boolean;
  error?: string | null;
  onAddLocation: (loc: SearchResult) => void;
  isSaved: (loc: SearchResult) => boolean;
}

export default function SearchedLocations({
  locations,
  loading,
  error,
  onAddLocation,
  isSaved,
}: SearchedLocationsProps) {
  if (loading) return <div className="py-3 text-sm text-white">Searching…</div>;
  if (error) return <div className="py-3 text-sm text-red-600">{error}</div>;
  if (!locations.length) return <div className="py-3 text-sm text-white">No results</div>;

  return (
    <div className="flex flex-col gap-3">
      {locations.map((loc) => {
        const disabled = isSaved(loc);
        return (
          <div
            key={loc.id}
            className="flex justify-between items-center px-4 py-3 border-b last:border-b-0 border-[color:var(--border)]/60"
          >
            <div className="text-base">
              <h4 className="font-semibold text-white">{loc.displayName}</h4>
            </div>
            <ButtonWithIcon
              onClick={() => onAddLocation(loc)}
              disabled={disabled}
              aria-disabled={disabled}
            />
          </div>
        );
      })}
    </div>
  );
}
