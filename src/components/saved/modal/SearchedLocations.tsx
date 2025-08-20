import { ButtonWithIcon } from "@/components/ui/add";

type SearchResult = {
  id: string;
  name: string;
  state: string | null;
  country: string;
  lat: number;
  lon: number;
  displayName: string;
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
  if (loading) return <div className="py-3 text-sm">Searching…</div>;
  if (error) return <div className="py-3 text-sm text-red-600">{error}</div>;
  if (!locations.length) return <div className="py-3 text-sm">No results</div>;

  return (
    <div className="flex flex-col gap-3">
      {locations.map((loc) => {
        const disabled = isSaved(loc);
        return (
          <div
            key={loc.id}
            className="flex justify-between items-center py-2 border-b last:border-none"
          >
            <div className="text-base">
              <h4 className="font-medium">{loc.displayName}</h4>
              <p className="text-xs opacity-70">
                lat {loc.lat.toFixed(2)}, lon {loc.lon.toFixed(2)}
              </p>
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
