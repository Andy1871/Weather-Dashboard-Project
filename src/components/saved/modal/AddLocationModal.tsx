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
  onAddLocation: (loc: SearchResult) => void; // expects display name
  savedLocations: string[]; // array of display names
}


type SearchResult = {
  id: string;
  name: string;
  state: string | null;
  country: string;
  lat: number;
  lon: number;
  displayName: string; // "City, State, Country"
};

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

  useEffect(() => {
    if (!open) return; // only search when modal is open
    const term = searchTerm.trim();

    // Clear results when empty
    if (!term) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Debounce
    const t = setTimeout(async () => {
      // cancel previous request
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
        setResults(data.results as SearchResult[]);
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setError(e.message ?? "Search failed");
        }
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
  

  // For quick disable checks
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

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search for new location</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <SearchBar
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-black placeholder:text-black"
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
