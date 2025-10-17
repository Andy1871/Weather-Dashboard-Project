import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Use inside Server Components, Server Actions, and Route Handlers */
export function supabaseServer() {
  return createServerClient(url, anon, {
    // Some Next setups type cookies() as async; make these methods async to be safe.
    cookies: {
      async get(name: string) {
        const store = await cookies();
        return store.get(name)?.value;
      },
      async set(name: string, value: string, options?: CookieOptions) {
        const store = await cookies();
        store.set({ name, value, ...options });
      },
      async remove(name: string, options?: CookieOptions) {
        const store = await cookies();
        store.set({ name, value: "", ...options });
      },
    },
  });
}
