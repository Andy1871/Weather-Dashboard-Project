
"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBar from "../SearchBar";
import TodayForecast from "../ui/TodayForecast";
import WeekForecast from "../ui/WeekForecast";
import { Card } from "@/components/ui/card";
import * as React from "react";
import {
  toTodayItems,
  toWeekItems,
  getTz,
  type WeatherBundle,
} from "@/lib/weatherAdapter";

type Fav = { name: string; state?: string; lat?: number; lon?: number };

const LS_KEY = "favourite-location";
const DEFAULT_FAV: Fav = { name: "Reading, UK" };

export default function FavouriteLocationCard() {
  const [favourite, setFavourite] = useState<Fav | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [bundle, setBundle] = useState<WeatherBundle | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<
    { name: string; country: string; lat: number; lon: number }[]
  >([]);

  // tz state (from the bundle)
  const [tz, setTz] = useState<string | null>(null);
  const [tzOffset, setTzOffset] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      setFavourite(raw ? (JSON.parse(raw) as Fav) : DEFAULT_FAV);
    } catch {
      setFavourite(DEFAULT_FAV);
    }
  }, []);

  const saveFavourite = (next: Fav) => {
    setFavourite(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {}
  };

  useEffect(() => {
    const fetchWeather = async () => {
      if (!favourite) return;
      setLoading(true);
      setError(null);
      try {
        const body =
          typeof favourite.lat === "number" && typeof favourite.lon === "number"
            ? { lat: favourite.lat, lon: favourite.lon, units: "metric" }
            : { q: favourite.name, units: "metric" };

        const res = await fetch("/api/weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = (await res.json()) as any;
        if (!res.ok) throw new Error(data?.error || "Failed to fetch weather");

        setDisplayName(data.name);
        setBundle(data as WeatherBundle);

        // tz info for formatting
        const { tz, tzOffset } = getTz(data as WeatherBundle);
        setTz(tz);
        setTzOffset(tzOffset ?? null);

        // persist coords if provided
        if (data?.coords?.lat && data?.coords?.lon) {
          saveFavourite({
            name: data.name,
            lat: data.coords.lat,
            lon: data.coords.lon,
          });
        }
      } catch (e: any) {
        setError(e.message ?? "Error fetching weather");
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [favourite?.name, favourite?.lat, favourite?.lon]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
            input
          )}&limit=10&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );
        const data = await res.json();
        const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
        setSuggestions(
          data.map((d: any) => ({
            name: d.name,
            state: d.state || "",
            country: countryNames.of(d.country),
            lat: d.lat,
            lon: d.lon,
          }))
        );
      } catch {
        setSuggestions([]);
      }
    };
    const t = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(t);
  }, [input]);

  const handleSelectSuggestion = (s: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  }) => {
    saveFavourite({ name: `${s.name}, ${s.country}`, lat: s.lat, lon: s.lon });
    setInput("");
    setSuggestions([]);
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: input.trim(), units: "metric" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Location not found");

      saveFavourite({
        name: data.name,
        lat: data.coords.lat,
        lon: data.coords.lon,
      });
      setDisplayName(data.name);
      setBundle(data as WeatherBundle);

      const { tz, tzOffset } = getTz(data as WeatherBundle);
      setTz(tz);
      setTzOffset(tzOffset ?? null);

      setInput("");
    } catch (e: any) {
      setError(e.message ?? "Error searching location");
    } finally {
      setLoading(false);
    }
  };

  const title = useMemo(
    () => displayName || favourite?.name || "Favourite Location",
    [displayName, favourite?.name]
  );

  // match your card theme
  const surfaceVars = {
    "--card": "oklch(from var(--background) l c h / 0.08)",
    "--card-foreground": "oklch(0.98 0 0)",
    "--border": "oklch(1 0 0 / 0.26)",
    "--muted-foreground": "oklch(0.96 0 0 / 0.85)",
  } as React.CSSProperties & Record<string, string>;

  // tz-aware time formatter (this fixes the “two long numbers”)
  const formatHM = (unix?: number) => {
    if (!unix) return "—";
    const base = new Date(unix * 1000);
    if (tz) {
      try {
        return base.toLocaleTimeString("en-GB", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {}
    }
    if (typeof tzOffset === "number") {
      const shifted = new Date((unix + tzOffset) * 1000);
      return shifted.toLocaleTimeString("en-GB", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return base.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  // tz-aware weekday for the week list
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

  // build items from adapter when bundle is present
  const todayItems =
    bundle ? toTodayItems(bundle, { formatHM }) : [];
  const weekItems =
    bundle ? toWeekItems(bundle, { weekdayFor }) : [];

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between relative z-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Favourite Location</h2>
        <div className="w-full sm:w-[380px]">
          <SearchBar
            placeholder="Choose favourite location"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSubmit={handleSubmit}
            onSelectSuggestion={handleSelectSuggestion}
          />
        </div>
      </div>

      <Card style={surfaceVars} className="mt-6 rounded-2xl backdrop-blur-md border shadow-md">
        <div className="px-5 pt-5">
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>

        <div className="p-4">
          {loading && <p className="opacity-80">Loading weather…</p>}
          {error && <p className="text-red-200">{error}</p>}

          {!loading && !error && bundle && (
            <>
              <TodayForecast dt={bundle.todayForecast.dt} data={todayItems as any} />
              <WeekForecast data={weekItems} />
            </>
          )}
        </div>
      </Card>
    </>
  );
}
