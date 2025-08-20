import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

const continents = [
  "Asia",
  "Africa",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

const continentImages: Record<string, string> = {
  Asia: "asia.jpg",
  Africa: "africa.jpg", // This one is a PNG
  Europe: "europe.jpg",
  "North America": "north-america.png",
  Oceania: "oceania.jpg",
  "South America": "south-america.jpg",
};

export default function ContinentsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 py-5 items-stretch">
      {continents.map((continent) => (
        <Link
          href={`/continents/${continent.toLowerCase().replace(" ", "-")}`}
          className="transition-transform duration-200 hover:scale-103 h-full w-full"
          key={continent}
        >
          <Card className="relative h-full flex flex-col justify-between bg-white/20 backdrop-blur-md text-white border border-white/30">
            <div className="absolute top-0 right-0 h-full w-[40%] sm:w-[50%] z-0">
              <Image
                src={`/icons/${continentImages[continent]}`}
                alt={continent}
                className="object-cover opacity-30"
                fill
              />
            </div>
            <CardHeader className="relative">
              <CardTitle className="text-2xl font-bold">{continent}</CardTitle>
              <CardDescription className="text-gray-200">
                Click through to view a list of capitals by country from{" "}
                {continent}.
              </CardDescription>
              {/* <CardAction>Card Action</CardAction> */}
            </CardHeader>
            <CardFooter className="flex justify-end z-2">
              <p>
                View {continent} --------{">"}
              </p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
