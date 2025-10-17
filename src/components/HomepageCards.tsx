import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as React from "react";

const cards = [
  {
    href: "/savedLocations",
    title: "Saved Locations",
    desc:
      "Pin your favourite places for instant access. Unlimited saves, organized and quick.",
    cta: "View saved locations",
  },
  {
    href: "/continents",
    title: "Capitals by Continent",
    desc:
      "Browse every capital by region and see today’s conditions at a glance.",
    cta: "View continents",
  },
  // {
  //   href: "/explore",
  //   title: "Explore & Compare",
  //   desc:
  //     "Search any city worldwide and compare two locations side by side.",
  //   cta: "Explore locations",
  // },
];

export default function HomepageCards() {
  const surfaceVars = {
    "--card": "oklch(from var(--background) l c h / 0.08)",
    "--card-foreground": "oklch(0.98 0 0)",
    "--border": "oklch(1 0 0 / 0.26)",
    "--muted-foreground": "oklch(0.96 0 0 / 0.85)",
  } as React.CSSProperties & Record<string, string>;

  return (
    <div className="section">
      <div className="grid items-stretch gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Card
              className="h-full min-h-[220px] rounded-2xl backdrop-blur-md border shadow-md transition-transform duration-200 ease-out hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.02] grid grid-rows-[auto_1fr_auto]"
              style={surfaceVars}
            >
              <CardHeader className="p-6 pt-8">
                <CardTitle className="text-2xl font-extrabold tracking-tight">
                  {c.title}
                </CardTitle>
                <CardDescription className="mt-2 text-sm leading-relaxed">
                  {c.desc}
                </CardDescription>
              </CardHeader>

              {/* middle 1fr row acts as spacer so footers align */}

              <CardFooter className="p-6 pt-0 flex justify-end items-center">
                <p className="text-sm tracking-wide opacity-90">
                  {c.cta} <span aria-hidden>→</span>
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
