import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavigationButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  disabled?: boolean;
  isActive?: boolean;
}
export function NavigationButton({
  onClick,
  icon: Icon,
  isActive,
  disabled,
}: NavigationButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-10 px-2",
        "flex items-center justify-center",
        "rounded-full",
        "text-muted-foreground",
        "transition-all duration-200",
        "hover:bg-muted/70 active:bg-muted/50",
        disabled && "opacity-50 pointer-events-none",
        isActive && "bg-muted/50"
      )}
    >
      <Icon
        className={cn(
          "h-6 w-6",
          "transition-transform",
          isActive && "scale-105"
        )}
      />
    </button>
  );
}
