import { ArrowLeft, MenuIcon } from "lucide-react";
import { useRef, useState } from "react";
import SidebarMenu from "./SidebarMenu";

type ViewType =
  | "main"
  | "search"
  | "settings"
  | "contacts"
  | "archived"
  | "new_message"
  | "new_group"
  | "new_channel";

interface SidebarHeaderProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
}

const SidebarHeader = ({ view, onViewChange }: SidebarHeaderProps) => {
  const [menu, setMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleSearchFocus = () => {
    onViewChange("search");
    setMenu(false);
  };

  return (
    <div className="h-16 flex items-center px-4 border-b border-divider">
      {view === "main" && (
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={() => setMenu((prev) => !prev)}
            className="p-2 border hover:bg-hover rounded-full"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <div className="flex-1 ml-3">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              className="w-full bg-search-input rounded-full px-4 py-2 focus:outline-none"
              onFocus={handleSearchFocus}
            />
          </div>
        </div>
      )}

      {view === "search" && (
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={() => onViewChange("main")}
            className="p-2 border hover:bg-hover rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 ml-3">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              className="w-full bg-search-input rounded-full px-4 py-2 focus:outline-none"
              onFocus={handleSearchFocus}
            />
          </div>
        </div>
      )}

      {menu && <SidebarMenu setShowMenu={() => setMenu(false)} />}
    </div>
  );
};

export default SidebarHeader;
