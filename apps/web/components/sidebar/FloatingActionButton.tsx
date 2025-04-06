import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, User, Users, Volume, X } from "lucide-react";
import { Button } from "../ui/button";
import { ViewType } from "@/types";

interface FBProps {
  onViewChange: (view: ViewType) => void;
}

const FloatingActionButton = ({ onViewChange }: FBProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute bottom-6 right-6">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button className="h-14 w-14 flex items-center justify-center bg-primary border rounded-full">
            {open ? <X className="h-6 w-6" /> : <Pencil className="h-6 w-6" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 mb-1 space-y-2"
          alignOffset={20}
        >
          <DropdownMenuItem onClick={() => onViewChange("new_message")}>
            <div className="flex items-center gap-4 px-2 py-1">
              <User size={16} />
              <p>New Private Chat</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewChange("new_group")}>
            <div className="flex items-center gap-4 px-2 py-1">
              <Users size={16} />
              <p>New Group</p>
            </div>
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            <div className="flex items-center gap-4 px-2">
              <Volume size={16} />
              <p>New Channel</p>
            </div>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FloatingActionButton;
