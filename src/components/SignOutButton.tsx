"use client";

import { supabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const onClick = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <button
      onClick={onClick}
      className="text-white/80 text-sm hover:text-white transition-colors"
    >
      Sign out
    </button>
  );
}
