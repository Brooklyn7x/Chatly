import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";

interface HeaderButtonProps {
  onPrivateModalOpen: () => void;
  onGroupModalOpen: () => void;
  onContactModalOpen: () => void;
  onSettingModalOpen: () => void;
}
const HeaderButton = ({
  onContactModalOpen,
  onGroupModalOpen,
  onPrivateModalOpen,
  onSettingModalOpen,
}: HeaderButtonProps) => {
  return (
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
  );
};

export default HeaderButton;
