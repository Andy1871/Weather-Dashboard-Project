// components/saved/SavedLocationCardContainer.tsx
"use client";

import { useEffect, useState } from "react";
import SavedLocationCard from "./SavedLocationCard";
import { Card } from "@/components/ui/card";
import { type WeatherBundle } from "@/lib/weatherAdapter";

type Props = {
  id: string;
  title: string;
  lat: number;
  lon: number;
  onRemove: () => void;
};

export default function SavedLocationCardContainer({
  id, title, lat, lon, onRemove
}: Props) {
  const [bundle, setBundle] = useState<WeatherBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const surfaceVars = {
    "--card": "oklch(from var(--background) l c h / 0.08)",
    "--card-foreground": "oklch(0.98 0 0)",
    "--border": "oklch(1 0 0 / 0.26)",
    "--muted-foreground": "oklch(0.96 0 0 / 0.85)",
  } as React.CSSProperties & Record<string, string>;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setErr(null);

    fetch(`/api/weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lon, units: "metric" }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Weather failed (${r.status})`);
        const j = (await r.json()) as WeatherBundle;
        if (active) setBundle(j);
      })
      .catch((e) => active && setErr(e.message))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [lat, lon]);

  if (loading) {
    return (
      <Card style={surfaceVars} className="rounded-2xl backdrop-blur-md border shadow-md mb-6 p-5 animate-pulse">
        <div className="h-6 w-48 bg-white/20 rounded mb-4" />
        <div className="h-24 w-full bg-white/10 rounded" />
      </Card>
    );
  }

  if (err || !bundle) {
    return (
      <Card style={surfaceVars} className="rounded-2xl backdrop-blur-md border shadow-md mb-6 p-5">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-bold text-white">{title}</div>
            <div className="text-sm text-red-200">{err ?? "No data"}</div>
          </div>
          <button onClick={onRemove} className="text-sm underline text-white/90">Remove</button>
        </div>
      </Card>
    );
  }

  return (
    <SavedLocationCard
      location={title}
      bundle={bundle}
      onRemove={onRemove}
    />
  );
}
