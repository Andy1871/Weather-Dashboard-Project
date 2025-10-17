import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import * as React from "react";

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
  Africa: "africa.jpg",
  Europe: "europe.jpg",
  "North America": "north-america.png",
  Oceania: "oceania.jpg",
  "South America": "south-america.jpg",
};

export default function ContinentsCards() {
  const surfaceVars = {
    "--card": "oklch(from var(--background) l c h / 0.08)",
    "--card-foreground": "oklch(0.98 0 0)",
    "--border": "oklch(1 0 0 / 0.26)",
    "--muted-foreground": "oklch(0.96 0 0 / 0.85)",
  } as React.CSSProperties & Record<string, string>;

  return (
    <div className="section">
      <div className="grid items-stretch gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {continents.map((continent) => (
          <Link
            key={continent}
            href={`/continents/${continent.toLowerCase().replace(" ", "-")}`}
            className="block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Card
              className="h-full min-h-[220px] rounded-2xl backdrop-blur-md border shadow-md transition-transform duration-200 ease-out hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.02] relative overflow-hidden grid grid-rows-[auto_1fr_auto]"
              style={surfaceVars}
            >
              <div
                aria-hidden
                className="absolute inset-y-0 right-0 z-0"
                style={{
                  width: "55%", 
                  backgroundImage: `url(/icons/${continentImages[continent]})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right center",
                  backgroundSize: "contain", 
                  opacity: 0.6,               
                  filter: "grayscale(15%) contrast(110%)",
                  pointerEvents: "none",
                }}
              />

              <CardHeader className="p-6 pt-2 relative z-10">
                <CardTitle className="text-2xl font-extrabold tracking-tight">
                  {continent}
                </CardTitle>
                <CardDescription className="mt-2 text-sm leading-relaxed">
                  Browse capital cities across {continent}. Tap a country to see
                  live temperatures and the week ahead.
                </CardDescription>
              </CardHeader>

              <CardFooter className="pr-6 pt-0 pb-2 flex justify-end items-center relative z-10">
                <p className="text-sm tracking-wide opacity-90">
                  View {continent} <span aria-hidden>→</span>
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
