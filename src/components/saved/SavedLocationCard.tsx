"use client";

import TodayForecast from "../ui/TodayForecast";
import WeekForecast from "../ui/WeekForecast";
import { ButtonWithRemove } from "../ui/remove";
import { Card } from "@/components/ui/card";
import * as React from "react";
import {
  toTodayItems,
  toWeekItems,
  getTz,
  type WeatherBundle,
} from "@/lib/weatherAdapter";

interface SavedLocationCardProps {
  location: string;
  bundle: WeatherBundle; // passed down from SavedLocationCardContainer - contains weather payload that we pass to Week/Day forecast
  onRemove: () => void;
}

export default function SavedLocationCard({
  location,
  bundle,
  onRemove,
}: SavedLocationCardProps) {
  const surfaceVars = {
    "--card": "oklch(from var(--background) l c h / 0.08)",
    "--card-foreground": "oklch(0.98 0 0)",
    "--border": "oklch(1 0 0 / 0.26)",
    "--muted-foreground": "oklch(0.96 0 0 / 0.85)",
  } as React.CSSProperties & Record<string, string>;

  // tz helpers (same as Favourite)
  const { tz, tzOffset } = getTz(bundle);

  const formatHM = (unix?: number) => {
    if (!unix) return "—";
    const base = new Date(unix * 1000);
    if (tz) {
      try {
        return base.toLocaleTimeString("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit" });
      } catch {}
    }
    if (typeof tzOffset === "number") {
      const shifted = new Date((unix + tzOffset) * 1000);
      return shifted.toLocaleTimeString("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit" });
    }
    return base.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  const weekdayFor = (unix: number) => {
    const base = new Date(unix * 1000);
    if (tz) {
      try {
        return base.toLocaleDateString("en-GB", { weekday: "short", timeZone: tz });
      } catch {}
    }
    if (typeof tzOffset === "number") {
      const shifted = new Date((unix + tzOffset) * 1000);
      return shifted.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" });
    }
    return base.toLocaleDateString("en-GB", { weekday: "short" });
  };

  const todayItems = toTodayItems(bundle, { formatHM });
  const weekItems = toWeekItems(bundle, { weekdayFor });

  return (
    <Card
      style={surfaceVars}
      className="rounded-2xl backdrop-blur-md border shadow-md mb-6"
    >
      <div className="px-5 pt-5">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">{location}</h3>
          <ButtonWithRemove onClick={onRemove} />
        </div>
      </div>

      <div className="p-4">
        <TodayForecast dt={bundle.todayForecast.dt} data={todayItems as any} />
        <WeekForecast data={weekItems} />
      </div>
    </Card>
  );
}
