"use client";

import { Plus } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import SearchBar from "../../SearchBar";
import { useState } from "react";
import SearchedLocations from "./SearchedLocations";
// import { Label } from "@/components/ui/label"

interface AddLocationModalProps {
  onAddLocation: (locationName: string) => void;
  savedLocations: string[];
}

export function AddLocationModal({
  onAddLocation,
  savedLocations,
}: AddLocationModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer ">
          Add <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search for new location</DialogTitle>
          {/* <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription> */}
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            {/* <Label htmlFor="link" className="sr-only">
              Link
            </Label> */}
            <SearchBar
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-black placeholder:text-black"
            />
          </div>
        </div>
        <SearchedLocations
          onAddLocation={onAddLocation}
          savedLocations={savedLocations}
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
