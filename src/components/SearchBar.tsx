import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

export interface SearchBarProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: () => void;
  suggestions?: {
    name: string;
    state: string;
    country: string;
    lat: number;
    lon: number;
  }[];
  onSelectSuggestion?: (s: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  }) => void;
}

export default function SearchBar({
  placeholder,
  value,
  onChange,
  onSubmit,
  suggestions = [],
  onSelectSuggestion,
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) {
            e.preventDefault();
            onSubmit();
          }
        }}
        className="pl-9 rounded-xl text-gray-200 placeholder:text-gray-200"
      />

      {/* Dropdown for results */}
      {suggestions.length > 0 && (
        <ul className="absolute mt-1 w-full bg-white/90 text-black rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => onSelectSuggestion?.(s)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-200"
            >
              {[s.name, s.state, s.country].filter(Boolean).join(", ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
