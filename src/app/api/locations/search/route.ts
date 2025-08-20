// app/api/locations/search/route.ts
import { NextResponse } from "next/server";

const API = "https://api.openweathermap.org/geo/1.0/direct";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const limit = Number(searchParams.get("limit") ?? 5);

  if (!q) {
    return NextResponse.json({ results: [] }, { status: 200 });
  }

  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Missing OPENWEATHER_API_KEY" },
      { status: 500 }
    );
  }

  const url = `${API}?q=${encodeURIComponent(q)}&limit=${limit}&appid=${key}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Upstream geocoding failed" },
      { status: 502 }
    );
  }

  const data = (await res.json()) as Array<{
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
  }>;

  // Normalize for your UI
  const results = data.map((d, i) => ({
    id: `${d.name}-${d.state ?? ""}-${d.country}-${d.lat}-${d.lon}-${i}`,
    name: d.name,
    country: d.country,
    state: d.state ?? null,
    lat: d.lat,
    lon: d.lon,
    displayName: [d.name, d.state, d.country].filter(Boolean).join(", "),
  }));

  return NextResponse.json({ results });
}
