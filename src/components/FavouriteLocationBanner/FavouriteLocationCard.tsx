"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import TodayForecast from "@/components/ui/TodayForecast";
import WeekForecast from "@/components/ui/WeekForecast";
import {
  toTodayItems,
  toWeekItems,
  getTz,
  type WeatherBundle,
} from "@/lib/weatherAdapter";
import { supabaseBrowser } from "@/lib/supabase/client";
import { AddLocationModal } from "@/components/saved/modal/AddLocationModal";
import { setFavouriteByDetails } from "@/app/actions/setFavouriteByDetails";

type Row = {
  location_id: string;
  display_name: string;
  lat: number;
  lon: number;
  is_favorite?: boolean;
};

export default function FavouriteLocationCard() {
  const supabase = supabaseBrowser();

  const [userId, setUserId] = useState<string | null>(null);
  const [fav, setFav] = useState<Row | null>(null);

  const [bundle, setBundle] = useState<WeatherBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- session -> userId ---
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

  // --- load favourite for this user ---
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
        .select("location_id,display_name,lat,lon,is_favorite")
        .eq("user_id", userId)
        .eq("is_favorite", true)
        .limit(1)
        .maybeSingle();

      if (!on) return;
      if (error) {
        setError("Could not load favourite location");
        setLoading(false);
        return;
      }
      setFav(data ?? null);
      setLoading(false);
    })();
    return () => {
      on = false;
    };
  }, [userId, supabase]);

  // --- fetch weather when favourite changes ---
  useEffect(() => {
    if (!fav) {
      setBundle(null);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);

    fetch("/api/weather", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat: fav.lat, lon: fav.lon, units: "metric" }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Weather failed (${r.status})`);
        const j = (await r.json()) as WeatherBundle;
        if (active) setBundle(j);
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [fav?.location_id, fav?.lat, fav?.lon]);

  // --- title / tz helpers ---
  const title = useMemo(
    () =>
      fav?.display_name ||
      (userId ? "Choose your favourite location" : "Favourite Location"),
    [fav?.display_name, userId]
  );
  const { tz, tzOffset } = bundle
    ? getTz(bundle)
    : { tz: null as string | null, tzOffset: null as number | null };

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
    return base.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const weekdayFor = (unix: number) => {
    const base = new Date(unix * 1000);
    if (tz) {
      try {
        return base.toLocaleDateString("en-GB", {
          weekday: "short",
          timeZone: tz,
        });
      } catch {}
    }
    if (typeof tzOffset === "number") {
      const shifted = new Date((unix + tzOffset) * 1000);
      return shifted.toLocaleDateString("en-GB", {
        weekday: "short",
        timeZone: "UTC",
      });
    }
    return base.toLocaleDateString("en-GB", { weekday: "short" });
  };

  const todayItems = bundle ? toTodayItems(bundle, { formatHM }) : [];
  const weekItems = bundle ? toWeekItems(bundle, { weekdayFor }) : [];

  // --- Add/Set favourite WITHOUT adding to saved list ---
  // Reuse your existing AddLocationModal; when user picks a result, write favourite directly.
  const handleAddAsFavourite = async (r: {
    id: string;
    displayName: string;
    lat: number;
    lon: number;
  }) => {
    if (!userId) {
      setError("Please sign in to set a favourite location.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await setFavouriteByDetails({
        display_name: r.displayName,
        lat: r.lat,
        lon: r.lon,
      });
      // reflect in UI (client-side state)
      setFav({
        location_id: r.id, // client placeholder; DB row has its own id
        display_name: r.displayName,
        lat: r.lat,
        lon: r.lon,
        is_favorite: true,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to set favourite");
    } finally {
      setLoading(false);
    }
  };

  const surfaceVars = {
    "--card": "oklch(from var(--background) l c h / 0.08)",
    "--card-foreground": "oklch(0.98 0 0)",
    "--border": "oklch(1 0 0 / 0.26)",
    "--muted-foreground": "oklch(0.96 0 0 / 0.85)",
  } as React.CSSProperties & Record<string, string>;

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between relative z-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Favourite Location
        </h2>

        {/* Reuse your modal for search/select; we don't add to saved list */}
        <AddLocationModal
          onAddLocation={handleAddAsFavourite}
          savedLocations={fav ? [fav.display_name] : []}
        />
      </div>

      <Card
        style={surfaceVars}
        className="mt-6 rounded-2xl backdrop-blur-md border shadow-md"
      >
        <div className="px-5 pt-5">
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>

        <div className="p-4">
          {loading && <p className="opacity-80">Loading…</p>}
          {error && <p className="text-red-200">{error}</p>}

          {!loading && !error && fav && bundle && (
            <>
              <TodayForecast
                dt={bundle.todayForecast.dt}
                data={todayItems as any}
              />
              <WeekForecast data={weekItems} />
            </>
          )}

          {!loading && !error && !fav && userId && (
            <p className="opacity-80">
              Pick a location using the “Add location” button.
            </p>
          )}
        </div>
      </Card>
    </>
  );
}
