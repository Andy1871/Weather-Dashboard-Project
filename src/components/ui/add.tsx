import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ButtonWithIconProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function ButtonWithIcon({ onClick, disabled }: ButtonWithIconProps) {
    return (
      <Button variant="outline" size="sm" className="cursor-pointer" onClick={onClick} disabled={disabled}>
         <Plus /> 
      </Button>
    )
  }
  