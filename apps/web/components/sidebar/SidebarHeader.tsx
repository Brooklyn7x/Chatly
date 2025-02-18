import { MenuIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SidebarMenu from "./SidebarMenu";
import { useState, useRef } from "react";
import { useClickAway } from "@/hooks/useClickAway";

type ViewType = "main" | "search" | "new_message" | "new_group" | "new_channel";
interface SidebarHeaderProps {
  view: ViewType;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SidebarHeader({
  view,
  searchQuery,
  onSearchChange,
}: SidebarHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickAway(menuRef, () => {
    setShowMenu(false);
  });

  return (
    <div className="h-16 flex items-center px-4 border-b gap-3" ref={menuRef}>
      {view === "main" && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 border"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search chats"
              className="pl-12 h-10 text-base rounded-full bg-background"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </>
      )}

      {showMenu && <SidebarMenu />}
    </div>
  );
}
