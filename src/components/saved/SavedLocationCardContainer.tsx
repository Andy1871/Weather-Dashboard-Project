"use client";

import { useEffect, useState } from "react";
import SavedLocationCard from "./SavedLocationCard";

type Props = {
  id: string;
  title: string; // displayName
  lat: number;
  lon: number;
  onRemove: () => void;
};

type Forecast = {
  dt: number;
  todayForecast: { heading: string; info: string }[];
  weekForecast: { name: string; low: string; high: string }[];
};

export default function SavedLocationCardContainer({
  id, title, lat, lon, onRemove
}: Props) {
  const [data, setData] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setErr(null);

    fetch(`/api/forecast?lat=${lat}&lon=${lon}&units=metric`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`Forecast failed (${r.status})`);
        const j = await r.json();
        if (active) setData(j);
      })
      .catch((e) => active && setErr(e.message))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [lat, lon]);

  if (loading) {
    return (
      <div className="flex flex-col w-full bg-white/10 text-white border border-white/20 rounded-xl shadow-sm mb-6 p-5 animate-pulse">
        <div className="h-6 w-48 bg-white/20 rounded mb-4" />
        <div className="h-24 w-full bg-white/10 rounded" />
      </div>
    );
  }
  if (err || !data) {
    return (
      <div className="flex justify-between items-center w-full bg-red-500/10 text-red-200 border border-red-500/30 rounded-xl shadow-sm mb-6 p-5">
        <div>
          <div className="font-bold">{title}</div>
          <div className="text-sm">{err ?? "No data"}</div>
        </div>
        <button onClick={onRemove} className="text-sm underline">Remove</button>
      </div>
    );
  }

  return (
    <SavedLocationCard
      location={title}
      dt={data.dt}
      todayForecast={data.todayForecast}
      weekForecast={data.weekForecast}
      onRemove={onRemove}
    />
  );
}
