import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ButtonWithIconProps {
  onClick?: () => void;
}

export function ButtonWithIcon({ onClick }: ButtonWithIconProps) {
    return (
      <Button variant="outline" size="sm" className="cursor-pointer" onClick={onClick}>
        Add <Plus /> 
      </Button>
    )
  }
  