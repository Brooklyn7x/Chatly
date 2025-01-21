import { useState } from "react";
import { cn } from "@/lib/utils";
import { MenuItem } from "../shared/MenuItem";
import useAuth from "@/hooks/useAuth";
import { SearchInput } from "../shared/SearchInput";
import {
  ArrowRight,
  Bookmark,
  LogOut,
  Menu,
  Moon,
  Settings,
  User,
} from "lucide-react";
import useUserStatusStore from "@/store/useStatusStore";

interface SidebarHeaderProps {
  onSearchClick: () => void;
  onSearchActive?: boolean;
  onSearchQuery: string;
  onSetSearchQuery: (query: string) => void;
  onBackClick: () => void;
}

export function SidebarHeader({
  onSearchActive,
  onSearchClick,
  onSearchQuery,
  onSetSearchQuery,
  onBackClick,
}: SidebarHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useAuth();
  const userStatus = useUserStatusStore(
    (state) => state.userStatus[user?._id || ""]
  );
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const handleSearchClick = () => {
    onSearchClick();
  };

  return (
    <header className="h-16 px-4 border-b flex items-center gap-4">
      <button
        onClick={onSearchActive ? onBackClick : () => setShowMenu(!showMenu)}
        className={`h-10 px-2 flex items-center justify-center text-muted-foreground rounded-full transition-all duration-300 ease-in-out 
          ${onSearchActive || showMenu ? "bg-neutral-500/20" : "hover:bg-neutral-500/20"}
          transform ${onSearchActive || showMenu ? "rotate-180" : "rotate-0"}`}
      >
        {onSearchActive ? (
          <ArrowRight className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>
      <button onClick={handleSearchClick} className="w-full">
        <SearchInput
          value={onSearchQuery}
          onChange={onSetSearchQuery}
          placeholder="Search"
        />
      </button>
      <div
        className={cn(
          "absolute top-14 left-2 w-56 rounded-md z-20 shadow-md bg-background/70 border backdrop-blur-sm",
          "transform transition-all duration-200 ease-in-out origin-top-left",
          showMenu
            ? "scale-100 translate-y-0 opacity-100 pointer-events-auto"
            : "scale-75 -translate-y-2 opacity-0 pointer-events-none"
        )}
      >
        <div className="p-1 space-y-1">
          <div className="flex items-center gap-4 px-4 py-2 border-b">
            <User className="h-6 w-6" />
            <span className="font-medium">{user?.username || "User"}</span>
            <span
              className={cn(
                "absolute top-0 right-1 w-2.5 h-2.5 rounded-full border-2 border-background",
                {
                  "bg-green-500": userStatus === "online",
                  "bg-gray-400": userStatus !== "online",
                }
              )}
            />
          </div>

          <MenuItem
            icon={<Bookmark />}
            onClick={() => {}}
            label="Saved Messages"
          />
          <MenuItem icon={<User />} onClick={() => {}} label="Contact" />
          <MenuItem icon={<Settings />} onClick={() => {}} label="Settings" />
          <MenuItem icon={<Moon />} onClick={() => {}} label="Dark Mode" />
          <MenuItem icon={<LogOut />} onClick={handleLogout} label="Logout" />
        </div>
      </div>
    </header>
  );
}
