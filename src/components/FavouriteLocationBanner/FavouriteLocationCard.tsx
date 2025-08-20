"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBar from "../SearchBar";
import TodayForecast from "../ui/TodayForecast";
import WeekForecast from "../ui/WeekForecast";

type Today = {
  dt: number;
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity?: number;
  windSpeed?: number;
  sunrise?: number;
  sunset?: number;
};

type Day = {
  dt: number;
  min: number;
  max: number;
  description: string;
  icon: string;
  pop?: number;
};

type Fav = { name: string; state?: string; lat?: number; lon?: number };

const LS_KEY = "favourite-location";
const DEFAULT_FAV: Fav = { name: "Reading, UK" };

export default function FavouriteLocationCard() {
  const [favourite, setFavourite] = useState<Fav | null>(null); 
  const [displayName, setDisplayName] = useState<string>("");
  const [today, setToday] = useState<Today | null>(null);
  const [week, setWeek] = useState<Day[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<
    { name: string; country: string; lat: number; lon: number }[]
  >([]); // autocomplete list of city suggestions from search box

  // Load favourite from localStorage (or default) once (hence empty dependency array). 
  // we check localstorage for LS_KEY - if found, setFavourite, if not set it as default
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      setFavourite(raw ? (JSON.parse(raw) as Fav) : DEFAULT_FAV);
    } catch {
      setFavourite(DEFAULT_FAV);
    }
  }, []);

  // Saves favourite both in state and in local storage. 
  const saveFavourite = (next: Fav) => {
    setFavourite(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {}
  };

  // Fetch weather whenever favourite changes
  useEffect(() => {
    const fetchWeather = async () => {
      if (!favourite) return;
      setLoading(true);
      setError(null);
      try {
        // Prefer coords if we have them; otherwise search by name
        const body =
          typeof favourite.lat === "number" && typeof favourite.lon === "number"
            ? { lat: favourite.lat, lon: favourite.lon, units: "metric" }
            : { q: favourite.name, units: "metric" };
        
        // Standard data fetch from our api/weather
        const res = await fetch("/api/weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch weather");

        // Normalised payload from the API upgrade
        setDisplayName(data.name);
        setToday(data.todayForecast);
        setWeek(data.weekForecast);

        // Store name and coords if found by API
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favourite?.name, favourite?.lat, favourite?.lon]);

  // fetch city suggestions as user types
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
        const countryNames = new Intl.DisplayNames(["en"], { type: "region" }); // turning fetched country into their proper country names
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

    const t = setTimeout(fetchSuggestions, 400); // debounce
    return () => clearTimeout(t);
  }, [input]);

  // when user selects a suggestion - update favourite with name and coords. 
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

  // Search submission for user pressing enter
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

      // Update favourite with resolved name and coords
      saveFavourite({
        name: data.name,
        lat: data.coords.lat,
        lon: data.coords.lon,
      });
      setDisplayName(data.name);
      setToday(data.todayForecast);
      setWeek(data.weekForecast);
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

  return (
    <>
      <div className="mt-8 flex flex-row justify-between relative z-50">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-200">
          Favourite Location
        </h2>
        <SearchBar
          placeholder="Choose favourite location"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={handleSubmit}
          suggestions={suggestions}
          onSelectSuggestion={handleSelectSuggestion}
        />
      </div>

      <div className="flex flex-col w-full bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-xl shadow-sm mt-6">
        <h3 className="ml-5 mt-5 mb-2 text-xl font-bold">{title}</h3>

        <div className="p-4">
          {loading && <p className="opacity-80">Loading weather…</p>}
          {error && <p className="text-red-200">{error}</p>}

          {!loading && !error && today && (
            <>
              {/* Map API todayForecast -> TodayForecast props */}
              <TodayForecast
                dt={today.dt}
                data={[
                  { heading: "Temperature", info: `${today.temp}°C` },
                  { heading: "Feels Like", info: `${today.feelsLike}°C` },
                  { heading: "Condition", info: today.description },
                  { heading: "Humidity", info: `${today.humidity}%` },
                  { heading: "Wind", info: `${today.windSpeed} m/s` },
                ]}
              />

              {/* Map API weekForecast -> WeekForecast props */}
              <WeekForecast
                data={week.map((d) => {
                  const date = new Date(d.dt * 1000);
                  const dayName = date.toLocaleDateString("en-GB", {
                    weekday: "short",
                  });
                  return {
                    name: dayName,
                    low: `${d.min}°C`,
                    high: `${d.max}°C`,
                  };
                })}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
