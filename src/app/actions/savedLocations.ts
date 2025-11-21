"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

// Read all saved locations for current user
export async function getSaved() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("saved_locations")
    .select("location_id, display_name, lat, lon, is_favorite")
    .eq("user_id", user.id)
    .order("created_at");

  if (error) throw error;
  return data ?? [];
}

// Add a saved location
export async function addLocation(loc: {
  location_id: string;
  display_name: string;
  lat: number;
  lon: number;
}) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("saved_locations")
    .upsert({ user_id: user.id, ...loc }, { onConflict: "user_id,location_id" });

  if (error) throw error;
  revalidatePath("/saved-locations");
}

// Remove a saved location
export async function removeLocation(location_id: string) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("saved_locations")
    .delete()
    .eq("user_id", user.id)
    .eq("location_id", location_id);

  if (error) throw error;
  revalidatePath("/saved-locations");
}
