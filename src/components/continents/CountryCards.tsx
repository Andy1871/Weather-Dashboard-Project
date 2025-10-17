"use client";

import { Card } from "@/components/ui/card";
import { CountryWeather, LiveWeatherByCapital } from "@/types/weather";
import * as React from "react";

export interface CountryCardsProps {
  countries: CountryWeather[];
  liveWeatherByCapital: LiveWeatherByCapital;
}

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
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function CountryCards({
  countries,
  liveWeatherByCapital,
}: CountryCardsProps) {
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const withLive = countries.filter(
    (c) => !!liveWeatherByCapital[keyFromCapital(c.capital)]
  );

  const surfaceVars = {
    "--card": "oklch(from var(--background) l c h / 0.08)",
    "--card-foreground": "oklch(0.98 0 0)",
    "--border": "oklch(1 0 0 / 0.26)",
    "--muted-foreground": "oklch(0.96 0 0 / 0.85)",
  } as React.CSSProperties & Record<string, string>;

  return (
    <div className="grid grid-cols-2 gap-3 py-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {withLive.map((c) => {
        const live = liveWeatherByCapital[keyFromCapital(c.capital)];
        const now = Math.round(live!.temp);
        const hi = Math.round(live!.high);
        const lo = Math.round(live!.low);
        const timeStr = formatLocalTime(live!.tz, live!.tzOffset);
        const cond = titleCase(live!.description) || "—";
        const rain = typeof live!.pop === "number" ? `${live!.pop}% chance of rain` : "—";
        const conditionLine = `${cond} - ${rain}`;

        return (
          <Card
            key={`${c.country}-${c.capital}`}
            style={surfaceVars}
            className="rounded-xl backdrop-blur-md border shadow-sm px-3 py-3 hover:shadow-md transition"
          >
            {/* Two-column layout that collapses nicely */}
            <div className="flex gap-3 items-start">
              {/* LEFT: city, country, time, condition */}
              <div className="min-w-0 flex-1">
                <div className="truncate text-left text-lg font-semibold sm:text-xl leading-snug break-words line-clamp-2">
                  {c.capital}
                </div>
                <div className="truncate text-left text-sm opacity-80 sm:text-base">
                  {c.country}
                </div>
                <div className="text-left text-sm opacity-80">{timeStr}</div>

                {/* Condition stays on the left, slightly separated */}
                <div className="mt-1 text-left text-xs sm:text-sm opacity-80 leading-snug line-clamp-2">
                  {conditionLine}
                </div>
              </div>

              {/* RIGHT: big temp with low–high underneath */}
              <div className="shrink-0 text-right">
                <div className="leading-none text-5xl sm:text-5xl font-extrabold text-gray-100">
                  {Number.isFinite(now) ? `${now}°` : "—"}
                </div>
                <div className="mt-1 text-sm sm:text-base">
                  {Number.isFinite(lo) ? `${lo}°` : "—"} – {Number.isFinite(hi) ? `${hi}°` : "—"}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
