"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import SearchBar from "../SearchBar";
import TodayForecast from "../ui/TodayForecast";
import WeekForecast from "../ui/WeekForecast";
import {
  toTodayItems,
  toWeekItems,
  getTz,
  type WeatherBundle,
} from "@/lib/weatherAdapter";
import { supabaseBrowser } from "@/lib/supabase/client";

type SavedLocation = {
  id: string;
  user_id: string;
  name: string;
  lat: number;
  lon: number;
  is_favourite: boolean;
};

type Suggestion = {
  name: string;
  country: string;
  lat: number;
  lon: number;
};

export default function FavouriteLocationCard() {
  const supabase = supabaseBrowser();

  // user/session
  const [userId, setUserId] = useState<string | null>(null);

  // favourite + weather
  const [favourite, setFavourite] = useState<SavedLocation | null>(null);
  const [bundle, setBundle] = useState<WeatherBundle | null>(null);

  // ui state
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // tz from bundle
  const [tz, setTz] = useState<string | null>(null);

  // 1) load session -> userId
  useEffect(() => {
    let on = true;
    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!on) return;
      if (error) {
        setError("Could not load session");
        setLoading(false);
        return;
      }
      setUserId(data.session?.user?.id ?? null);
    })();
    return () => {
      on = false;
    };
  }, [supabase]);

  // 2) fetch favourite from DB when we have a user
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("Please sign in to set a favourite location.");
      return;
    }
    let on = true;
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("saved_locations")
        .select("id,user_id,name,lat,lon,is_favourite")
        .eq("user_id", userId)
        .eq("is_favourite", true)
        .limit(1)
        .maybeSingle();

      if (!on) return;
      if (error) {
        setError("Could not load favourite location");
        setLoading(false);
        return;
      }
      setFavourite(data ?? null);
      setLoading(false);
    })();
    return () => {
      on = false;
    };
  }, [userId, supabase]);

  // 3) fetch weather whenever favourite changes
  useEffect(() => {
    if (!favourite) {
      setBundle(null);
      setTz(null);
      return;
    }
    let cancelled = false;
    (async () => {
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

        const data: unknown = await res.json();
        if (!res.ok) {
          const msg =
            typeof data === "object" && data && "error" in (data as Record<string, unknown>)
              ? String((data as Record<string, unknown>).error)
              : "Failed to fetch weather";
          throw new Error(msg);
        }

        if (cancelled) return;
        const wb = data as WeatherBundle;
        setBundle(wb);
        try {
          const info = getTz(wb);
          setTz(info.tz ?? null);
        } catch {
          setTz(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error fetching weather");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [favourite?.id, favourite?.lat, favourite?.lon, favourite?.name]);

  // 4) geocoding suggestions (via your API so no public key on client)
  useEffect(() => {
    const t = setTimeout(async () => {
      if (input.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`/api/geo?q=${encodeURIComponent(input)}&limit=10`);
        if (!res.ok) {
          setSuggestions([]);
          return;
        }
        const raw: unknown = await res.json();
        if (!Array.isArray(raw)) {
          setSuggestions([]);
          return;
        }
        const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
        const mapped: Suggestion[] = raw.map((d: any) => ({
          name: d.name,
          country: countryNames.of(d.country) ?? d.country ?? "",
          lat: d.lat,
          lon: d.lon,
        }));
        setSuggestions(mapped);
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [input]);

  // 5) set favourite in DB
  const setFavouriteInDb = async (next: { name: string; lat: number; lon: number }) => {
    if (!userId) {
      setError("Please sign in to set a favourite location.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // (a) unset previous favourites for this user
      await supabase
        .from("saved_locations")
        .update({ is_favourite: false })
        .eq("user_id", userId)
        .eq("is_favourite", true);

      // (b) see if a saved row already exists for this lat/lon (or name)
      const { data: existing, error: findErr } = await supabase
        .from("saved_locations")
        .select("id")
        .eq("user_id", userId)
        .eq("lat", next.lat)
        .eq("lon", next.lon)
        .limit(1)
        .maybeSingle();

      if (findErr) throw findErr;

      if (existing?.id) {
        // update existing row to favourite
        const { data, error } = await supabase
          .from("saved_locations")
          .update({ is_favourite: true, name: next.name })
          .eq("id", existing.id)
          .select("id,user_id,name,lat,lon,is_favourite")
          .single();
        if (error) throw error;
        setFavourite(data);
      } else {
        // insert new favourite row
        const { data, error } = await supabase
          .from("saved_locations")
          .insert({
            user_id: userId,
            name: next.name,
            lat: next.lat,
            lon: next.lon,
            is_favourite: true,
          })
          .select("id,user_id,name,lat,lon,is_favourite")
          .single();
        if (error) throw error;
        setFavourite(data);
      }
      setInput("");
      setSuggestions([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save favourite");
    } finally {
      setLoading(false);
    }
  };

  // 6) SearchBar handlers
  const handleSelectSuggestion = async (s: Suggestion) => {
    await setFavouriteInDb({
      name: `${s.name}, ${s.country}`,
      lat: s.lat,
      lon: s.lon,
    });
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    if (suggestions.length > 0) {
      await handleSelectSuggestion(suggestions[0]);
      return;
    }
    try {
      const res = await fetch(`/api/geo?q=${encodeURIComponent(input)}&limit=1`);
      const arr: unknown = await res.json();
      if (Array.isArray(arr) && arr[0]) {
        const first = arr[0] as { name: string; country: string; lat: number; lon: number };
        await handleSelectSuggestion({
          name: first.name,
          country: new Intl.DisplayNames(["en"], { type: "region" }).of(first.country) ??
            first.country ??
            "",
          lat: first.lat,
          lon: first.lon,
        });
      } else {
        setError("Location not found");
      }
    } catch {
      setError("Location not found");
    }
  };

  const title = useMemo(() => {
    if (favourite) return favourite.name;
    if (userId) return "Choose your favourite location";
    return "Favourite Location";
  }, [favourite, userId]);

  const surfaceVars = {
    "--card": "oklch(from var(--background) l c h / 0.08)",
    "--card-foreground": "oklch(0.98 0 0)",
    "--border": "oklch(1 0 0 / 0.26)",
    "--muted-foreground": "oklch(0.96 0 0 / 0.85)",
  } as React.CSSProperties & Record<string, string>;

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
    return base.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  const weekdayFor = (unix: number) =>
    new Date(unix * 1000).toLocaleDateString("en-GB", { weekday: "short" });

  const todayItems = bundle ? toTodayItems(bundle, { formatHM }) : [];
  const weekItems = bundle ? toWeekItems(bundle, { weekdayFor }) : [];

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
          {loading && <p className="opacity-80">Loading…</p>}
          {error && <p className="text-red-200">{error}</p>}

          {!loading && !error && favourite && bundle && (
            <>
              <TodayForecast dt={bundle.todayForecast?.dt} data={todayItems as unknown as any} />
              <WeekForecast data={weekItems} />
            </>
          )}

          {!loading && !error && !favourite && userId && (
            <p className="opacity-80">Pick a location above to set your favourite.</p>
          )}
        </div>
      </Card>
    </>
  );
}
