export type WeatherBundle = {
    name: string;
    todayForecast: {
      dt: number;
      temp: number;
      feelsLike: number;
      description: string;
      icon: string;
      humidity?: number;
      windSpeed?: number;
      sunrise?: number;  // unix (s)
      sunset?: number;   // unix (s)
    };
    weekForecast: Array<{
      dt: number;        // unix (s)
      min: number;
      max: number;
      description: string;
      icon: string;
      pop?: number;
    }>;
    timezone?: string;
    timezone_offset?: number;
  };
  
  const safeRound = (n: unknown) =>
    typeof n === "number" && Number.isFinite(n) ? Math.round(n) : NaN;
  
  const msToMph = (ms?: number) =>
    typeof ms === "number" && Number.isFinite(ms) ? Math.round(ms * 2.236936) : null;
  
  export function getTz(b: WeatherBundle) {
    return {
      tz: typeof b.timezone === "string" ? b.timezone : null,
      tzOffset: typeof b.timezone_offset === "number" ? b.timezone_offset : null,
    };
  }
  
  export function toTodayItems(
    b: WeatherBundle,
    opts?: { formatHM?: (unix?: number) => string }
  ) {
    const t = b.todayForecast;
    const d0 = b.weekForecast?.[0];
    const pop = typeof d0?.pop === "number" ? `${Math.round(d0.pop * 100)}%` : "—";
    const subRange =
      d0 && Number.isFinite(d0.min) && Number.isFinite(d0.max)
        ? `${safeRound(d0.min)}°C - ${safeRound(d0.max)}°C`
        : undefined;
  
    const f = opts?.formatHM ?? ((x?: number) => String(x ?? "—"));
  
    return [
      { heading: "Current Temp", info: `${safeRound(t.temp)}°C`, subInfo: subRange },
      { heading: "Feels Like", info: `${safeRound(t.feelsLike)}°C` },
      { heading: "Condition", info: t.description ?? "—" },
      { heading: "Humidity", info: `${typeof t.humidity === "number" ? t.humidity : "—"}%` },
      { heading: "Wind", info: `${msToMph(t.windSpeed) ?? "—"} mph` },
      { heading: "Rain", info: pop },
      { heading: "Sunrise", info: f(t.sunrise) },
      { heading: "Sunset", info: f(t.sunset) },
    ] as Array<{ heading: string; info: string; subInfo?: string }>;
  }
  
  export function toWeekItems(
    b: WeatherBundle,
    opts?: { weekdayFor?: (unix: number) => string }
  ) {
    const days = Array.isArray(b.weekForecast) ? b.weekForecast : [];
    const weekday = opts?.weekdayFor ?? ((u: number) =>
      new Date(u * 1000).toLocaleDateString("en-GB", { weekday: "short" })
    );
  

    return days.slice(0, 7).map((d) => ({
      name: weekday(d.dt),
      low: `${safeRound(d.min)}°C`,
      high: `${safeRound(d.max)}°C`,
      pop: typeof d.pop === "number" ? d.pop : undefined,
    }));
  }
  