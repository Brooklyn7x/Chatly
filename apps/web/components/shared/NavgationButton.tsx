import { LucideIcon } from "lucide-react";

interface NavigationButtonProps {
  onClick: () => void;
  icon: LucideIcon;
}

export default function NavigationButton({
  onClick,
  icon: Icon,
}: NavigationButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-muted-foreground rounded-full 
                    transition-colors hover:bg-muted/70"
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}
