import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Plus, Search, X } from "lucide-react";

interface SidebarHeaderProps {
  search: string | null;
  setSearch: (search: string) => void;
  onPrivateModalOpen: () => void;
  onGroupModalOpen: () => void;
  onContactModalOpen: () => void;
  onSettingModalOpen: () => void;
}

const SidebarHeader = ({
  search,
  setSearch,
  onContactModalOpen,
  onPrivateModalOpen,
  onGroupModalOpen,
  onSettingModalOpen,
}: SidebarHeaderProps) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chatly</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="rounded-full h-9 w-9">
              <Plus className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-sm bg-background">
            <DropdownMenuItem onClick={onPrivateModalOpen}>
              New chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onGroupModalOpen}>
              Create Group
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onContactModalOpen}>
              Add Contact
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSettingModalOpen}>
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-5 relative">
        <Search
          className="absolute left-3 top-2.5 text-muted-foreground"
          size={16}
        />
        <Input
          value={search || ""}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Chat Search..."
          className="border pl-10 bg-input border-input"
        />
        {search && search.length > 0 && (
          <X
            className="absolute right-3 top-2.5 text-muted-foreground cursor-pointer"
            size={16}
            onClick={() => setSearch("")}
          />
        )}
      </div>
    </div>
  );
};

export default SidebarHeader;
