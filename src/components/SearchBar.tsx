import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: () => void;
  className?: string;
}

export default function SearchBar({
  placeholder,
  value,
  onChange,
  onSubmit,
  className,
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${className}`} />
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
        className={`pl-9 rounded-xl text-gray-200 placeholder:text-gray-200 ${className}`}
      />
    </div>
  );
}
