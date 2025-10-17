// app/continents/[continent]/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import CountryCards from "@/components/continents/CountryCards";
import SearchBar from "@/components/SearchBar";
import africa from "@/data/continents/africa";
import asia from "@/data/continents/asia";
import europe from "@/data/continents/europe";
import northAmerica from "@/data/continents/north-america";
import oceania from "@/data/continents/oceania";
import southAmerica from "@/data/continents/south-america";
import AppHeader from "@/components/AppHeader";
import { LiveWeatherByCapital, CountryWeather } from "@/types/weather";
import { useParams } from "next/navigation";

const dataByContinent: Record<string, CountryWeather[]> = {
  africa,
  asia,
  europe,
  "north-america": northAmerica,
  oceania,
  "south-america": southAmerica,
};

export default function ContinentPage() {
  const { continent } = useParams<{ continent: string }>();
  const countries = dataByContinent[continent] || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [weatherMap, setWeatherMap] = useState<LiveWeatherByCapital>({});

  // Normalized title (e.g. "north-america" -> "North America")
  const title = useMemo(
    () =>
      (continent || "")
        .replace("-", " ")
        .replace(/\b\w/g, (ch) => ch.toUpperCase()),
    [continent]
  );

  useEffect(() => {
    if (!countries.length) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locations: countries }), // batch mode
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Weather API failed:", res.status, text);
          return;
        }

        const rows = await res.json(); // array of { ...loc, ok, data? }

        const map: LiveWeatherByCapital = {};
        for (const row of rows) {
          if (!row?.ok || !row?.data?.todayForecast) continue;

          const key = String(row.capital).trim().toLowerCase();
          const tf = row.data.todayForecast;
          const d0 = Array.isArray(row.data.weekForecast)
            ? row.data.weekForecast[0]
            : null;

          // temps
          const temp = Math.round(tf?.temp ?? NaN);
          const high = Math.round(d0?.max ?? tf?.temp ?? NaN);
          const low = Math.round(d0?.min ?? tf?.temp ?? NaN);

          // description (prefer current condition, then daily)
          const description =
            (tf?.description as string) ??
            (d0?.summary as string) ??
            (d0?.description as string) ??
            null;

          // rain chance (0..1 -> 0..100)
          const pop =
            typeof d0?.pop === "number" ? Math.round(d0.pop * 100) : null;

          // tz info (so cards can render local time)
          const tz =
            typeof row.data.timezone === "string" ? row.data.timezone : null;
          const tzOffset =
            typeof row.data.timezone_offset === "number"
              ? row.data.timezone_offset
              : null;

          map[key] = { temp, high, low, description, pop, tz, tzOffset };
        }

        if (!cancelled) setWeatherMap(map);
      } catch (err) {
        console.error("Weather API fetch threw:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [continent, countries]);

  const filteredLocations = useMemo(
    () =>
      countries.filter(
        (l) =>
          l.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.capital.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [countries, searchTerm]
  );

  return (
    <div>
      <AppHeader title={title} />

      <div>
        <SearchBar
          placeholder="Search by Country or Capital"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <CountryCards
        countries={filteredLocations}
        liveWeatherByCapital={weatherMap}
      />
    </div>
  );
}
