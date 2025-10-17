"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr"; // same lib you use for other actions

export async function setFavourite(location_id: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  // get current user (from auth cookie)
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) throw new Error("Not authenticated");

  // unset previous favourites for this user
  const { error: unsetErr } = await supabase
    .from("saved_locations")
    .update({ is_favorite: false })
    .eq("user_id", user.id)
    .eq("is_favorite", true);
  if (unsetErr) throw unsetErr;

  // set this row as favourite
  const { error: setErr } = await supabase
    .from("saved_locations")
    .update({ is_favorite: true })
    .eq("user_id", user.id)
    .eq("location_id", location_id);
  if (setErr) throw setErr;

  return { ok: true };
}
