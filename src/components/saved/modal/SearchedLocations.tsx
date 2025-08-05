import { ButtonWithIcon } from "@/components/ui/add";

interface SearchedLocationsProps {
  onAddLocation: (location: string) => void;
  savedLocations: string[];
}


const locations = [
  "Carlisle, UK",
  "Madrid, Spain",
  "Seattle, USA",
  "Dubai, UAE",
  "Sydney, Australia",
];

export default function SearchedLocations({
  onAddLocation,
  savedLocations,
}: SearchedLocationsProps) {
  return (
    <div className="flex flex-col gap-3">
      {locations.map((location, index) => {
        const isAlreadySaved = savedLocations.some(
          (saved) => saved.toLowerCase() === location.toLowerCase()
        );

        return (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b last:border-none"
          >
            <h4 className="text-base font-medium">{location}</h4>
            <ButtonWithIcon
              onClick={() => onAddLocation(location)}
              disabled={isAlreadySaved}
            />
          </div>
        );
      })}
    </div>
  );
}
