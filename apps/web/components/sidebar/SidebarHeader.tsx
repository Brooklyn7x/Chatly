import { ArrowLeft, MenuIcon } from "lucide-react";
import { useRef, useState } from "react";
import { SearchInput } from "../shared/SearchInput";
import SidebarMenu from "./Menu";

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
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleSearchFocus = () => {
    onViewChange("search");
    setMenu(false)
  };

  return (
    <div className="h-[60px] flex items-center px-4 border-b border-divider">
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
        <SearchHeader
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onBack={() => onViewChange("main")}
        />
      )}

      {menu && (
        <SidebarMenu showMenu={menu} setShowMenu={() => setMenu(false)} />
      )}
    </div>
  );
};

export default SidebarHeader;

interface SearchHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  onBack: () => void;
}

const SearchHeader = ({ query, onQueryChange, onBack }: SearchHeaderProps) => {
  return (
    <div className="flex items-center gap-4 w-full">
      <button
        onClick={onBack}
        className={`p-2 border borderflex items-center justify-center text-muted-foreground rounded-full transition-all duration-300 ease-in-out
        }`}
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <SearchInput
        value={query}
        onChange={onQueryChange}
        placeholder="Search"
      />
    </div>
  );
};
