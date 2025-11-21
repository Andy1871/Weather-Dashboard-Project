import type { CountryWeather, LiveWeatherByCapital } from "@/types/weather";

const keyFromCapital = (c: string) => c.trim().toLowerCase();

export async function buildLiveWeatherByCapital(
  countries: CountryWeather[],
  opts: { baseUrl?: string; units?: "metric" | "imperial" } = {}
): Promise<LiveWeatherByCapital> {
  const baseUrl =
    opts.baseUrl ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    "http://localhost:3000";

  const units = opts.units ?? "metric";

  const entries = await Promise.all(
    countries.map(async (c) => {
      try {
        const res = await fetch(`${baseUrl}/api/weather`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: c.lat, lon: c.lon, units }),
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`wx ${res.status}`);
        const wx = await res.json();

        const today = wx?.todayForecast;
        const d0 = Array.isArray(wx?.weekForecast) ? wx.weekForecast[0] : null;

        const temp = Math.round(today?.temp ?? NaN);
        const high = Math.round(d0?.max ?? NaN);
        const low = Math.round(d0?.min ?? NaN);

        // description - prefer today's current condition
        const description: string | null =
          (today?.description as string) ??
          (d0?.summary as string) ??
          (d0?.description as string) ??
          null;

        // percentage of precipitation
        const popPct: number | null =
          typeof d0?.pop === "number" ? Math.round(d0.pop * 100) : null;

        // timezone info 
        const tz: string | null =
          typeof wx?.timezone === "string" ? wx.timezone : null;
        const tzOffset: number | null =
          typeof wx?.timezone_offset === "number" ? wx.timezone_offset : null;

        return [
          keyFromCapital(c.capital),
          { temp, high, low, description, pop: popPct, tz, tzOffset },
        ] as const;
      } catch {
        return [keyFromCapital(c.capital), null] as const;
      }
    })
  );

  const map: LiveWeatherByCapital = {};
  for (const [k, v] of entries) {
    if (v) map[k] = v;
  }
  return map;
}
