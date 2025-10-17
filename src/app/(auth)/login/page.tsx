"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    try {
      setLoading(true);
      const supabase = supabaseBrowser();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } finally {
      // Supabase will redirect; this is just a guard for local errors
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center">
      <Card className="w-full max-w-sm rounded-2xl border-white/10 bg-white/5 backdrop-blur-md">
        <CardHeader className="text-center text-white">
          <CardTitle className="text-xl ">
            Sign in to access your customisable Weather App
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Button
            onClick={signIn}
            disabled={loading}
            className="w-full h-11 rounded-xl gap-2"
            size="lg"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    opacity="0.25"
                  />
                  <path
                    d="M22 12a10 10 0 0 1-10 10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
                Redirecting…
              </>
            ) : (
              <>
                {/* Google “G” */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[18px] w-[18px]"
                  viewBox="0 0 533.5 544.3"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M533.5 278.4c0-17.4-1.6-34.1-4.8-50.2H272v95.0h147.3c-6.4 34.5-25.8 63.8-55 83.5l88.8 69.1c51.8-47.7 80.4-118.1 80.4-197.4z"
                  />
                  <path
                    fill="#34A853"
                    d="M272 544.3c72.9 0 134.2-24.1 178.9-65.5l-88.8-69.1c-24.6 16.6-56.1 26.3-90.1 26.3-69 0-127.5-46.5-148.4-109.1H32.9v68.6C77.2 488.9 168.1 544.3 272 544.3z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M123.6 326.9c-10.5-31.5-10.5-65.7 0-97.2v-68.6H32.9c-42.6 84.9-42.6 185.8 0 270.6l90.7-68.6z"
                  />
                  <path
                    fill="#EA4335"
                    d="M272 106.1c39.6-.6 77.5 14.8 106.3 42.9l79.5-79.5C406.1 24.3 342.4-.2 272 0 168.1 0 77.2 55.5 32.9 164.1l90.7 68.6C144.5 152.1 203 106.1 272 106.1z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
