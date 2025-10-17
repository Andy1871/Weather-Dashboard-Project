import { getSaved } from "@/app/actions/savedLocations";
import SavedLocations from "@/components/saved/SavedLocations";

export default async function SavedLocationsPage() {
  const initial = await getSaved();
  return <SavedLocations initial={initial} />;
}
