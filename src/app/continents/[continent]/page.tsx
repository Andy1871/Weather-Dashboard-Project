// app/continents/[continent]/page.tsx
"use client";

import { useState, useEffect } from "react";
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

interface Props {
  params: Promise<{ continent: string }>;
}

export default function ContinentPage({ params }: Props) {
  const { continent } = useParams<{ continent: string }>();
  const countries = dataByContinent[continent] || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [weatherMap, setWeatherMap] = useState<LiveWeatherByCapital>({});

  useEffect(() => {
    if (!countries.length) return;

    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locations: countries }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Weather API failed:", res.status, text);
          return;
        }

        const rows = await res.json();

        const map: LiveWeatherByCapital = {};
        rows.forEach((row: any) => {
          if (row.ok && row.data?.main) {
            const key = String(row.capital).trim().toLowerCase();
            map[key] = {
              temp: row.data.main.temp,
              high: row.data.main.temp_max,
              low: row.data.main.temp_min,
            };
          }
        });

        if (!cancelled) setWeatherMap(map);
      } catch (err) {
        console.error("Weather API fetch threw:", err);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [continent]);

  const filteredLocations = countries.filter((location) => {
    return (
      location.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.capital.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      <AppHeader
        title={continent
          .replace("-", " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())}
      />

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
