import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SidebarMenu from "./SidebarMenu";
import { useState } from "react";
type ViewType = "main" | "search" | "new_message" | "new_group" | "new_channel";
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
  return (
    <div className="h-16 flex items-center px-4 border-b gap-2">
      {view === "main" && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats"
              className="pl-10 rounded-full bg-background"
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
