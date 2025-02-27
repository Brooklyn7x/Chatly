import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MessageCircle, Pencil, Users, Volume, X } from "lucide-react";
import { useState } from "react";
type ViewType = "main" | "search" | "new_message" | "new_group" | "new_channel";
interface FBProps {
  onViewChange: (view: ViewType) => void;
}

const FloatingActionButton = ({ onViewChange }: FBProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute bottom-6 right-6">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full h-14 w-14">
            {open ? <X size={32} /> : <Pencil size={32} />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 mb-1" alignOffset={20}>
          <DropdownMenuItem onClick={() => onViewChange("new_message")}>
            <div className="flex items-center gap-4 px-1">
              <MessageCircle size={16} />
              <p>New Chat</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewChange("new_group")}>
            <div className="flex items-center gap-4 px-2 py-1">
              <Users size={16} />
              <p>New Group</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex items-center gap-4 px-1">
              <Volume size={16} />
              <p>New Channel</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FloatingActionButton;
