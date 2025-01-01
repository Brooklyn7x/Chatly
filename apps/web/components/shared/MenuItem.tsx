import { IconNode, Bookmark } from "lucide-react";

interface MenuItemProps {
  onClick: () => void;
  label?: string;
  icon?: any;
}
export function MenuItem({ onClick, label, icon }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-5 hover:bg-muted/80 w-full rounded-sm px-4 py-2 transition-colors"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}
