import { Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ButtonWithRemoveProps {
  onClick?: () => void;
}

export function ButtonWithRemove({ onClick }: ButtonWithRemoveProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="cursor-pointer text-black"
      onClick={onClick}
    >
      Remove <Minus />
    </Button>
  );
}
