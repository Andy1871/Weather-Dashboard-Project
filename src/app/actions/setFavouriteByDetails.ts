"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

type Payload = {
  display_name: string;
  lat: number;
  lon: number;
};

export async function setFavouriteByDetails(payload: Payload) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) throw new Error("Not authenticated");

  // 1) unset previous favourite
  const { error: unsetErr } = await supabase
    .from("saved_locations")
    .update({ is_favorite: false })
    .eq("user_id", user.id)
    .eq("is_favorite", true);
  if (unsetErr) throw unsetErr;

  // 2) upsert favourite row (unique per user on lat/lon OR on (user_id, is_favorite) via trigger)
  // Try to find existing row for these coords
  const { data: existing, error: findErr } = await supabase
    .from("saved_locations")
    .select("location_id")
    .eq("user_id", user.id)
    .eq("lat", payload.lat)
    .eq("lon", payload.lon)
    .maybeSingle();
  if (findErr) throw findErr;

  if (existing?.location_id) {
    const { error: updErr } = await supabase
      .from("saved_locations")
      .update({ is_favorite: true, display_name: payload.display_name })
      .eq("user_id", user.id)
      .eq("location_id", existing.location_id);
    if (updErr) throw updErr;
  } else {
    const { error: insErr } = await supabase
      .from("saved_locations")
      .insert({
        user_id: user.id,
        display_name: payload.display_name,
        lat: payload.lat,
        lon: payload.lon,
        is_favorite: true,
      });
    if (insErr) throw insErr;
  }

  return { ok: true };
}
