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
    desc: "Pin your favourite places for instant access. Unlimited saves, organised and quick.",
    cta: "View saved locations",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: "/continents",
    title: "Capitals by Continent",
    desc: "Browse every capital by region and see today's conditions at a glance.",
    cta: "View continents",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  // {
  //   href: "/explore",
  //   title: "Explore & Compare",
  //   desc: "Search any city worldwide and compare two locations side by side.",
  //   cta: "Explore locations",
  //   icon: null,
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
      <div className="grid items-stretch gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Card
              className="h-full rounded-2xl backdrop-blur-md border shadow-md transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-white/[0.06] grid grid-rows-[auto_1fr_auto]"
              style={surfaceVars}
            >
              <CardHeader className="p-5 pb-2">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-white/60">{c.icon}</span>
                  <CardTitle className="text-lg font-bold tracking-tight">
                    {c.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs leading-relaxed opacity-70 pl-[29px]">
                  {c.desc}
                </CardDescription>
              </CardHeader>

              <CardFooter className="px-5 pb-4 pt-2 flex justify-end items-center">
                <p className="text-xs tracking-wide opacity-50">
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
