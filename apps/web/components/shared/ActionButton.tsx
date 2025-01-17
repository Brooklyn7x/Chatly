import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  icon: LucideIcon;
}

export const ActionButton = ({ onClick, disabled, icon: Icon }: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-14 w-14 rounded-full",
        "flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "hover:shadow-lg active:scale-95",
        "disabled:cursor-not-allowed disabled:opacity-50",
        !disabled
          ? "bg-blue-500 hover:bg-blue-600 text-white"
          : "bg-muted hover:bg-muted/60 text-muted-foreground"
      )}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
};
