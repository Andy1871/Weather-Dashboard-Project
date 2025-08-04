import { ButtonWithIcon } from "@/components/ui/add";

const locations = [
  "Carlisle, UK",
  "Madrid, Spain",
  "Seattle, USA",
  "Dubai, UAE",
  "Sydney, Australia",
];

export default function SearchedLocations({onAddLocation,}: {onAddLocation: (location: string) => void}) {
  return (
    <div className="flex flex-col gap-3">
      {locations.map((location, index) => (
        <div key={index} className="flex justify-between items-center py-2 border-b last:border-none">
          <h4 className="trext-base font-medium">{location}</h4>
          <ButtonWithIcon onClick={() => onAddLocation(location)} />
        </div>
      ))}
    </div>
  );
}
