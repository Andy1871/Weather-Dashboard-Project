"use client";

import { Plus } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SearchBar from "../../SearchBar";
import { useEffect, useMemo, useRef, useState } from "react";
import SearchedLocations from "./SearchedLocations";

interface AddLocationModalProps {
  onAddLocation: (loc: SearchResult) => void;
  savedLocations: string[];
}

type SearchResult = {
  id: string;
  name: string;
  state: string | null;
  country: string;    // may arrive as ISO code; we normalize to full name below
  lat: number;
  lon: number;
  displayName: string; // City, State, Country
};

// add commas to display name via 'parts' array
const composeDisplay = (...parts: Array<string | null | undefined>) =>
  parts.filter(Boolean).join(", ");

export function AddLocationModal({
  onAddLocation,
  savedLocations,
}: AddLocationModalProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const acRef = useRef<AbortController | null>(null);

  const surfaceVars = {
    "--card": "oklch(from var(--background) l c h / 0.08)",
    "--card-foreground": "oklch(0.98 0 0)",
    "--border": "oklch(1 0 0 / 0.26)",
    "--muted-foreground": "oklch(0.96 0 0 / 0.85)",
  } as React.CSSProperties & Record<string, string>;

  useEffect(() => {
    if (!open) return;
    const term = searchTerm.trim();

    if (!term) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // refresh abort after 300ms so not constantly calling API when typing
    const t = setTimeout(async () => {
      acRef.current?.abort();
      const ac = new AbortController();
      acRef.current = ac;

      try {
        const res = await fetch(
          `/api/locations/search?q=${encodeURIComponent(term)}&limit=8`,
          { signal: ac.signal }
        );
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();

        // Normalise country codes to full names and rebuild displayName 
        const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
        // treat data.results as array of SearchResults objects. r is just individual result
        const normalized: SearchResult[] = (data.results as SearchResult[]).map((r) => {
          //building search results as human readable text
          const fullCountry =
            r.country && r.country.length === 2
              ? (regionNames.of(r.country) as string) ?? r.country
              : r.country;
          const displayName = composeDisplay(r.name, r.state || undefined, fullCountry);
          return { ...r, country: fullCountry, displayName };
        });

        setResults(normalized);
      } catch (e: any) {
        if (e.name !== "AbortError") setError(e.message ?? "Search failed");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [searchTerm, open]);

  const handleAddAndClose = (r: SearchResult) => {
    onAddLocation(r);
    setSearchTerm("");
    setResults([]);
    setOpen(false);
  };

  // memoise items that have already been saved, used for cheks when rendering search results. only runs when savedLocations change
  const savedLower = useMemo(
    () => new Set(savedLocations.map((s) => s.toLowerCase())),
    [savedLocations]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          Add <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md rounded-2xl border shadow-md backdrop-blur-md bg-white/10"
        style={surfaceVars}
      >
        <DialogHeader>
          <DialogTitle className="text-white">Search for new location</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <SearchBar
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/80 text-black placeholder:text-black"
            />
          </div>
        </div>

        <SearchedLocations
          locations={results}
          loading={loading}
          error={error}
          onAddLocation={handleAddAndClose}
          isSaved={(r) => savedLower.has(r.displayName.toLowerCase())}
        />

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
