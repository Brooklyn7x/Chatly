import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SidebarMenu from "./SidebarMenu";
import { useState, useRef } from "react";
import { useClickAway } from "@/hooks/useClickAway";

type ViewType =
  | "main"
  | "search"
  | "new_message"
  | "new_group"
  | "new_channel"
  | "setting";
interface SidebarHeaderProps {
  view: ViewType;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewChange: (view: ViewType) => void;
}

export default function SidebarHeader({
  view,
  searchQuery,
  onSearchChange,
  onViewChange,
}: SidebarHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickAway(menuRef, () => {
    setShowMenu(false);
  });

  return (
    <div
      className="relative h-16 flex items-center px-4 border-b gap-3"
      ref={menuRef}
    >
      {view === "main" && (
        <>
          <button
            className="p-2 border rounded-full"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search chats"
              className="pl-12 py-5 text-base rounded-full bg-background"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </>
      )}

      {showMenu && <SidebarMenu onViewChange={onViewChange} />}
    </div>
  );
}
