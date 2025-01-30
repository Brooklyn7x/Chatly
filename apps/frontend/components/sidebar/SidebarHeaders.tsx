import { ArrowLeft, ArrowRight, MenuIcon } from "lucide-react";
import { useRef, useState } from "react";
import { SearchInput } from "../shared/SearchInput";

interface SidebarHeaderProps {
  view: string;
  onViewChange: (view: string) => void;
  onMenuToggle: () => void;
}

const SidebarHeader = ({
  view,
  onViewChange,
  onMenuToggle,
}: SidebarHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleSearchFocus = () => {
    onViewChange("search");
  };

  return (
    <div className="h-[60px] flex items-center px-4 border-b border-divider">
      {view === "main" && (
        <>
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-hover rounded-full"
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
        </>
      )}

      {view === "search" && (
        <SearchHeader
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onBack={() => onViewChange("main")}
        />
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
    <div className="flex gap-4 items-center w-full">
      <button
        onClick={onBack}
        className={`h-10 px-2 flex items-center justify-center text-muted-foreground rounded-full transition-all duration-300 ease-in-out 
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
