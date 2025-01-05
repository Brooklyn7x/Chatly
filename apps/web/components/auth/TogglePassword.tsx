import { cn } from "@/lib/utils";
import { Eye, EyeClosed } from "lucide-react";

interface PasswordToggleProps {
  showPassword: boolean;
  togglePassword: () => void;
  className?: string;
}

export const PasswordToggle = ({
  showPassword,
  togglePassword,
  className,
}: PasswordToggleProps) => (
  <button
    type="button"
    onClick={togglePassword}
    className={cn(
      "absolute top-1/2 right-2",
      "transform -translate-y-1/2",
      "rounded-sm p-2",
      "text-muted-foreground",
      "hover:bg-muted/50",
      "transition-all duration-200",
      className
    )}
    aria-label={showPassword ? "Hide password" : "Show password"}
    aria-pressed={showPassword}
  >
    {showPassword ? (
      <EyeClosed className="h-4 w-4" />
    ) : (
      <Eye className="h-4 w-4" />
    )}
  </button>
);
