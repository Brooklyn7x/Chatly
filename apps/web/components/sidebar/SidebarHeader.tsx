import { cn } from "@/lib/utils";
import { LogOut, Menu, Search } from "lucide-react";
import { useState } from "react";
import { MenuItem } from "../interface/MenuItem";
import useAuthStore from "@/store/useUserStore";
import useAuth from "@/hooks/useAuth";

interface SidebarHeaderProps {
  onSetSearchQuery: (query: string) => void;
  onSearchQuery: string;
}

export function SidebarHeader({
  onSearchQuery,
  onSetSearchQuery,
}: SidebarHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };
  return (
    <div className="h-16 px-4 border-b flex items-center gap-2">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={cn(
          "text-muted-foreground",
          "hover:bg-muted/60 hover:rounded-full p-2",
          "transition-all duration-300 ease-in-out",
          showMenu && "bg-muted/80 rounded-full rotate-180",
          "relative"
        )}
      >
        <Menu className="h-6 w-6" />
      </button>
      <div className="relative w-full">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <input
          value={onSearchQuery}
          onChange={(e) => onSetSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-2 bg-muted/50 rounded-lg border text-md outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search"
        />
      </div>

      {showMenu && (
        <div
          className={cn(
            "absolute top-14 left-0 w-[250px] p-1 rounded-md z-20 shadow-md bg-background/80 border backdrop-blur-sm",
            "transition-all ease-out",
            showMenu
              ? "animate-[slideIn_0.3s_ease-out_forwards]"
              : "animate-[slideOut_0.3s_ease-in_forwards]"
          )}
        >
          <MenuItem icon={<LogOut />} onClick={handleLogout} label="Logout" />
        </div>
      )}
    </div>
  );
}
