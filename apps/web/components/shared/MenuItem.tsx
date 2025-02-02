import { LucideIcon } from "lucide-react";

interface MenuItemProps {
  onClick: () => void;
  label?: string;
  icon: LucideIcon;
}
export function MenuItem({ onClick, label, icon: Icon }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-5 hover:bg-muted/60 w-full rounded-sm px-4 py-1.5 transition-colors"
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm">{label}</span>
    </button>
  );
}
