import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavigationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  className?: string;
  isActive?: boolean;
}
export function NavigationButton({
  icon: Icon,
  isActive,
  className,
  ...props
}: NavigationButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "h-10 px-2",
        "flex items-center justify-center",
        "rounded-full",
        "text-muted-foreground",
        "transition-all duration-200",
        "hover:bg-muted/90 active:bg-muted/50",
        props.disabled && "opacity-50 pointer-events-none",
        isActive && "bg-muted/50",
        className
      )}
      {...props}
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
