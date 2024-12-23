import { useState } from "react";
import { Edit2, User } from "lucide-react";
import { cn } from "@/lib/utils";
interface SidebarMenuProps {
  onCreateChat: () => void;
}

export function SidebarMenu({ onCreateChat }: SidebarMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const handleCreateChat = () => {
    onCreateChat();
    setShowMenu(false);
  };

  return (
    <div className="absolute bottom-6 right-6">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={cn(
          "h-14 w-14 text-center bg-muted/80 rounded-full flex items-center justify-center hover:bg-slate-500/80"
        )}
      >
        <Edit2 className="h-6 w-6" />
      </button>

      {showMenu && (
        <div className="absolute bottom-12 mb-2 right-8 w-[200px] border bg-background/90 backdrop-blur-sm z-20 p-1 rounded-md">
          <button
            onClick={handleCreateChat}
            className="w-full flex items-center gap-4 px-4 py-1 hover:bg-slate-500/50 hover:rounded-md"
          >
            <User className="h-4 w-4" />
            <span className="text-sm">New private chat</span>
          </button>
        </div>
      )}
    </div>
  );
}
