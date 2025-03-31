import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  ArrowBigDownDash,
  ArrowDown,
  ArrowDownAz,
  ChevronDown,
  MoreVertical,
} from "lucide-react";

const MessageActionDrop = () => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronDown className="h-5 w-5 text-primary-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Message Info</DropdownMenuItem>
          <DropdownMenuItem>Reply</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
          <DropdownMenuItem>Pin</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MessageActionDrop;
