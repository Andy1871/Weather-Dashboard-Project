import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Use inside Client Components (e.g., login/signout buttons) */
export function supabaseBrowser() {
  return createBrowserClient(url, anon);
}
