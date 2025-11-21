import { NextResponse } from "next/server";

const API = "https://api.openweathermap.org/data/2.5/onecall";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const units = searchParams.get("units") ?? "metric";

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
  }

  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Missing OPENWEATHER_API_KEY" },
      { status: 500 }
    );
  }

  const url = `${API}?lat=${lat}&lon=${lon}&units=${units}&appid=${key}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Upstream weather API failed" },
      { status: 502 }
    );
  }

  const data = await res.json();

  // normalise into card shape
  const todayForecast = [
    { heading: "Temp", info: `${Math.round(data.current.temp)}°` },
    { heading: "Feels", info: `${Math.round(data.current.feels_like)}°` },
    { heading: "Humidity", info: `${data.current.humidity}%` },
  ];

  const weekForecast = data.daily.slice(0, 5).map((d: any) => ({
    name: new Date(d.dt * 1000).toLocaleDateString("en-GB", {
      weekday: "short",
    }),
    low: `${Math.round(d.temp.min)}°`,
    high: `${Math.round(d.temp.max)}°`,
  }));

  return NextResponse.json({
    dt: data.current.dt,
    todayForecast,
    weekForecast,
  });
}
