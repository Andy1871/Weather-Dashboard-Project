export const runtime = "nodejs";
export const revalidate = 600;

import { NextResponse } from "next/server";


type Loc = { country: string; capital: string; lat: number; lon: number };

type TodayForecast = {
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

type DayForecast = {
  dt: number; // unix (UTC)
  min: number;
  max: number;
  description: string;
  icon: string;
  pop?: number; // 0..1
};

// Match weatherAdapter
type WeatherPayload = {
  name: string;
  coords: { lat: number; lon: number };
  units: "metric" | "imperial";
  todayForecast: TodayForecast;
  weekForecast: DayForecast[];
  timezone?: string;          // IANA tz from One Call 3.0 (e.g. "Europe/Paris")
  timezone_offset?: number;   // seconds from UTC (present in 3.0 and 2.5 current)
};

function isLocArray(x: unknown): x is Loc[] {
  return (
    // confirm x is array, then .every() tests whether all items in the array meet a condition
    Array.isArray(x) &&
    x.every(
      (i) =>
        i &&
        typeof (i as any).country === "string" &&
        typeof (i as any).capital === "string" &&
        typeof (i as any).lat === "number" &&
        typeof (i as any).lon === "number"
    )
  );
}


const OW_KEY = process.env.OPENWEATHER_API_KEY!;
const BASE = "https://api.openweathermap.org";

// Helpers 
function round(n: any) {
  return typeof n === "number" ? Math.round(n) : n;
}

function composeName(parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(", ");
}

async function geocodeDirect(q: string) {
  const url = `${BASE}/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=1&appid=${OW_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding failed");
  const arr = (await res.json()) as any[];
  const g = arr?.[0];
  if (!g) throw new Error("Location not found");
  const name = composeName([g.name, g.state, g.country]);
  return { lat: g.lat as number, lon: g.lon as number, name };
}

async function reverseGeocode(lat: number, lon: number) {
  const url = `${BASE}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OW_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return undefined;
  const arr = (await res.json()) as any[];
  const g = arr?.[0];
  if (!g) return undefined;
  return composeName([g.name, g.state, g.country]);
}

// One Call 3.0 (preferred)
async function fetchOneCall(lat: number, lon: number, units: string, lang: string) {
  const url = `${BASE}/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=${units}&lang=${lang}&appid=${OW_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`ONECALL3: ${res.status} ${text}`);
  }
  return res.json(); 
}

// Fallback 2.5 current + 5-day/3-hour, aggregate to daily min/max
async function fetch2p5Aggregated(lat: number, lon: number, units: string, lang: string) {
  const currUrl = `${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&lang=${lang}&appid=${OW_KEY}`;
  const fcUrl = `${BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&lang=${lang}&appid=${OW_KEY}`;

  const [currRes, fcRes] = await Promise.all([fetch(currUrl), fetch(fcUrl)]);
  if (!currRes.ok) {
    const t = await currRes.text().catch(() => "");
    throw new Error(`WX2.5: ${currRes.status} ${t}`);
  }
  if (!fcRes.ok) {
    const t = await fcRes.text().catch(() => "");
    throw new Error(`FC2.5: ${fcRes.status} ${t}`);
  }

  const current = await currRes.json();
  const forecast = await fcRes.json();

  // Today mapping
  const today: TodayForecast = {
    dt: current.dt,
    temp: round(current.main?.temp),
    feelsLike: round(current.main?.feels_like),
    description: current.weather?.[0]?.description ?? "",
    icon: current.weather?.[0]?.icon ?? "01d",
    humidity: current.main?.humidity,
    windSpeed: current.wind?.speed,
    sunrise: current.sys?.sunrise,
    sunset: current.sys?.sunset,
  };

  // Aggregate by UTC date
  const byDay = new Map<
    string,
    { min: number; max: number; icon: string; description: string; pop?: number; dt: number }
  >();

  for (const it of forecast.list as any[]) {
    const dt = it.dt as number; 
    const dayKey = new Date(dt * 1000).toISOString().slice(0, 10); 
    const min = it.main?.temp_min;
    const max = it.main?.temp_max;
    const icon = it.weather?.[0]?.icon ?? "01d";
    const desc = it.weather?.[0]?.description ?? "";
    const pop = typeof it.pop === "number" ? it.pop : undefined;

    const prev = byDay.get(dayKey);
    if (!prev) {
      byDay.set(dayKey, { min, max, icon, description: desc, pop, dt });
    } else {
      prev.min = Math.min(prev.min, min);
      prev.max = Math.max(prev.max, max);
      const hour = new Date(dt * 1000).getUTCHours();
      if (hour === 12) {
        prev.icon = icon;
        prev.description = desc;
      }
      if (typeof pop === "number") prev.pop = Math.max(prev.pop ?? 0, pop);
    }
  }

  const days: DayForecast[] = Array.from(byDay.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .slice(0, 7)
    .map(([_, v]) => ({
      dt: v.dt,
      min: round(v.min),
      max: round(v.max),
      description: v.description,
      icon: v.icon,
      pop: v.pop,
    }));

  // NOTE: 2.5 `current` has `timezone` = offset (seconds from UTC). No IANA tz here.
  const tzOffset: number | null = typeof current?.timezone === "number" ? current.timezone : null;

  return { today, days, tzOffset };
}

function mapOneCallToPayload(wx: any): { today: TodayForecast; days: DayForecast[] } {
  const today: TodayForecast = {
    dt: wx.current?.dt,
    temp: round(wx.current?.temp),
    feelsLike: round(wx.current?.feels_like),
    description: wx.current?.weather?.[0]?.description ?? "",
    icon: wx.current?.weather?.[0]?.icon ?? "01d",
    humidity: wx.current?.humidity,
    windSpeed: wx.current?.wind_speed,
    sunrise: wx.current?.sunrise,
    sunset: wx.current?.sunset,
  };

  const days: DayForecast[] = (wx.daily ?? []).slice(0, 7).map((d: any) => ({
    dt: d.dt,
    min: round(d.temp?.min),
    max: round(d.temp?.max),
    description: d.weather?.[0]?.description ?? "",
    icon: d.weather?.[0]?.icon ?? "01d",
    pop: d.pop,
  }));

  return { today, days };
}

async function fetchWeatherBundle(
  lat: number,
  lon: number,
  { units = "metric", lang = "en" }: { units?: "metric" | "imperial"; lang?: string }
) {
  // Try One Call 3.0 first, then fallback to 2.5 aggregation
  try {
    const wx = await fetchOneCall(lat, lon, units, lang);
    const { today, days } = mapOneCallToPayload(wx);
    // Return tz data from One Call 3.0
    return {
      today,
      days,
      tz: typeof wx?.timezone === "string" ? (wx.timezone as string) : undefined,
      tzOffset:
        typeof wx?.timezone_offset === "number" ? (wx.timezone_offset as number) : undefined,
      raw: wx,
      used: "onecall3" as const,
    };
  } catch (err) {
    console.error("ONECALL3 failed; using 2.5 fallback:", err);
    const { today, days, tzOffset } = await fetch2p5Aggregated(lat, lon, units, lang);
    return {
      today,
      days,
      tz: undefined,
      tzOffset: typeof tzOffset === "number" ? tzOffset : undefined,
      raw: undefined,
      used: "2p5" as const,
    };
  }
}

// POST handler 
export async function POST(req: Request) {
  try {
    if (!OW_KEY) {
      return NextResponse.json({ error: "Missing OPENWEATHER_API_KEY" }, { status: 500 });
    }

    const body = await req.json().catch(() => ({} as any));

    // Mode A: batch fetch. Used for continents page
    if (isLocArray(body?.locations)) {
      const { units = "metric", lang = "en" } = body as {
        units?: "metric" | "imperial";
        lang?: string;
      };

      const results = await Promise.all(
        (body.locations as Loc[]).map(async (l) => {
          try {
            const { today, days, tz, tzOffset } = await fetchWeatherBundle(l.lat, l.lon, {
              units,
              lang,
            });

            const name =
              (await reverseGeocode(l.lat, l.lon)) || composeName([l.capital, l.country]);

            const payload: WeatherPayload = {
              name,
              coords: { lat: l.lat, lon: l.lon },
              units,
              todayForecast: today,
              weekForecast: days,
              timezone: tz,
              timezone_offset: tzOffset,
            };

            return { ...l, ok: true as const, data: payload };
          } catch (e: any) {
            return {
              ...l,
              ok: false as const,
              error: e?.message ?? "Fetch error",
            };
          }
        })
      );

      return NextResponse.json(results);
    }

    // Mode B: single search — { q?: string, lat?: number, lon?: number, units?, lang? }
    const {
      q,
      lat,
      lon,
      units = "metric",
      lang = "en",
    }: {
      q?: string;
      lat?: number;
      lon?: number;
      units?: "metric" | "imperial";
      lang?: string;
    } = body || {};

    let latNum = typeof lat === "number" ? lat : undefined;
    let lonNum = typeof lon === "number" ? lon : undefined;
    let displayName: string | undefined;

    if (q && (latNum == null || lonNum == null)) {
      const geo = await geocodeDirect(q);
      latNum = geo.lat;
      lonNum = geo.lon;
      displayName = geo.name;
    }

    if (latNum == null || lonNum == null) {
      return NextResponse.json(
        { error: "Invalid payload", expected: "{ locations: Loc[] } OR { q | lat+lon }" },
        { status: 400 }
      );
    }

    const { today, days, tz, tzOffset } = await fetchWeatherBundle(latNum, lonNum, {
      units,
      lang,
    });

    const name =
      displayName || (await reverseGeocode(latNum, lonNum)) || `Lat ${latNum}, Lon ${lonNum}`;

    const payload: WeatherPayload = {
      name,
      coords: { lat: latNum, lon: lonNum },
      units,
      todayForecast: today,
      weekForecast: days,
      timezone: tz,
      timezone_offset: tzOffset,
    };

    return NextResponse.json(payload);
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
