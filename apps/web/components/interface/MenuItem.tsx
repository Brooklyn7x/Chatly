import { IconNode, Bookmark } from "lucide-react";

interface MenuItemProps {
  onClick?: () => void;
  label?: string;
  icon?: IconNode;
}
export function MenuItem({ onClick, label, icon }: MenuItemProps) {
  return (
    <button className="flex items-center gap-5 hover:bg-muted/80 w-full rounded-sm px-4 py-2 transition-colors">
      <Bookmark className="h-4 w-4" />
      <span className="text-sm">{label}</span>
    </button>
  );
}
