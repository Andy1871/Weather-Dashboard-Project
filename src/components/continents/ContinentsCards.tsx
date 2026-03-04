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
      <div className="grid items-stretch gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3">
        {continents.map((continent) => (
          <Link
            key={continent}
            href={`/continents/${continent.toLowerCase().replace(" ", "-")}`}
            className="block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Card
              className="h-full rounded-2xl backdrop-blur-md border shadow-md transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-white/[0.06] relative overflow-hidden grid grid-rows-[auto_1fr_auto]"
              style={surfaceVars}
            >
              <div
                aria-hidden
                className="absolute inset-y-0 right-0 z-0"
                style={{
                  width: "50%",
                  backgroundImage: `url(/icons/${continentImages[continent]})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right center",
                  backgroundSize: "contain",
                  opacity: 0.45,
                  filter: "grayscale(15%) contrast(110%)",
                  pointerEvents: "none",
                }}
              />

              <CardHeader className="p-5 pb-2 relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/50 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <CardTitle className="text-lg font-bold tracking-tight">
                    {continent}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs leading-relaxed opacity-70 pl-[22px]">
                  Browse capital cities across {continent}.
                </CardDescription>
              </CardHeader>

              <CardFooter className="px-5 pb-4 pt-2 flex justify-end items-center relative z-10">
                <p className="text-xs tracking-wide opacity-50">
                  View {continent} <span aria-hidden>-&gt;</span>
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
