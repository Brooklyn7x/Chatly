import { cn } from "@/lib/utils";
import { EllipsisVertical, Search, UserCircle2 } from "lucide-react";
import { useState } from "react";

interface ChatHeaderProps {
  onProfileClick: () => void;
}

export default function ChatHeader({ onProfileClick }: ChatHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  // const [onProfileClick, setonProfileClick] = useState(false);
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b relative">
      <button onClick={onProfileClick} className="flex items-center gap-4">
        <UserCircle2 className="h-7 w-7" />
        <span>Saved Messages</span>
      </button>

      <div className="flex items-center gap-6">
        <Search />
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={cn(
            "p-2 rounded-full transition-colors hover:bg-slate-100/10",
            showMenu && "bg-slate-100/10"
          )}
        >
          <EllipsisVertical className="h-5 w-5" />
        </button>
      </div>

      {showMenu && (
        <div
          className={cn(
            "absolute top-full right-2 bg-background/80 backdrop-blur-md border rounded-md shadow-md w-[200px] py-2 px-4",
            "transition-all duration-300 ease-in-out transform",
            showMenu
              ? "opacity-100 scale-100 translate-y-1"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          )}
        >
          <div>Menu</div>
        </div>
      )}
    </div>
  );
}
