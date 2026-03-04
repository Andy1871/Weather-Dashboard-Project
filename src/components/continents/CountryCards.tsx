"use client";

import { Card } from "@/components/ui/card";
import { CountryWeather, LiveWeatherByCapital } from "@/types/weather";
import * as React from "react";

export interface CountryCardsProps {
  countries: CountryWeather[];
  liveWeatherByCapital: LiveWeatherByCapital;
}

// must match the way keys are stored in liveWeatherByCapital
function keyFromCapital(capital: string) {
  return capital.trim().toLowerCase();
}

function titleCase(s?: string | null) {
  if (!s) return "";
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

function formatLocalTime(tz?: string | null, tzOffset?: number | null) {
  if (tz) {
    try {
      return new Date().toLocaleTimeString("en-GB", {
        timeZone: tz,
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {}
  }
  if (typeof tzOffset === "number" && Number.isFinite(tzOffset)) {
    const now = Date.now();
    const utcNow = now + new Date().getTimezoneOffset() * 60_000;
    const localMs = utcNow + tzOffset * 1000;
    return new Date(localMs).toLocaleTimeString("en-GB", {
      timeZone: "UTC",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CountryCards({
  countries,
  liveWeatherByCapital,
}: CountryCardsProps) {
  // re renders page after 60 seconds to keep date/time up to date
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  // ensure only countries with LIVE data are shown
  const withLive = countries.filter(
    (c) => !!liveWeatherByCapital[keyFromCapital(c.capital)],
  );

  const surfaceVars = {
    "--card": "oklch(from var(--background) l c h / 0.08)",
    "--card-foreground": "oklch(0.98 0 0)",
    "--border": "oklch(1 0 0 / 0.26)",
    "--muted-foreground": "oklch(0.96 0 0 / 0.85)",
  } as React.CSSProperties & Record<string, string>;

  return (
    <div className="grid grid-cols-2 gap-2.5 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {withLive.map((c) => {
        const live = liveWeatherByCapital[keyFromCapital(c.capital)];
        const now = Math.round(live!.temp);
        const hi = Math.round(live!.high);
        const lo = Math.round(live!.low);
        const timeStr = formatLocalTime(live!.tz, live!.tzOffset);
        const cond = titleCase(live!.description) || "—";
        const popPct =
          typeof live!.pop === "number" ? `${live!.pop}%` : null;

        return (
          <Card
            key={`${c.country}-${c.capital}`}
            style={surfaceVars}
            className="rounded-xl backdrop-blur-md border shadow-sm px-3 py-3 hover:shadow-md hover:bg-white/[0.06] transition-all duration-150"
          >
            <div className="flex gap-2 items-start justify-between">
              {/* LEFT: capital, country, time, condition */}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold leading-snug whitespace-normal break-words text-white">
                  {c.capital}
                </div>
                <div className="text-[11px] opacity-50 leading-snug whitespace-normal break-words mb-1.5">
                  {c.country}
                </div>

                <div className="text-[11px] opacity-60 tabular-nums">{timeStr}</div>
                <div className="text-[11px] opacity-50 leading-snug whitespace-normal break-words mt-0.5">
                  {cond}
                </div>
                {popPct && (
                  <div className="flex items-center gap-0.5 mt-1 opacity-45">
                    <svg aria-hidden viewBox="0 0 24 24" className="w-2.5 h-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C9 6 6 9.5 6 13a6 6 0 1 0 12 0c0-3.5-3-7-6-11z" />
                    </svg>
                    <span className="text-[10px]">{popPct}</span>
                  </div>
                )}
              </div>

              {/* RIGHT: current temp, hi/lo */}
              <div className="shrink-0 text-right">
                <div className="text-3xl sm:text-4xl font-extrabold leading-none text-white">
                  {Number.isFinite(now) ? `${now}°` : "—"}
                </div>
                <div className="mt-1 text-[11px] tabular-nums">
                  <span className="text-white/80 font-medium">
                    {Number.isFinite(hi) ? `${hi}°` : "—"}
                  </span>
                  <span className="text-white/30 mx-0.5">/</span>
                  <span className="text-white/40">
                    {Number.isFinite(lo) ? `${lo}°` : "—"}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
