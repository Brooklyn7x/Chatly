import { useState } from "react";
import { Edit2, User, Users, Volume, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarMenuProps {
  onCreateChat: () => void;
  onShowContactModal: () => void;
  onCreateGroup: () => void;
}

export function SidebarMenu({
  onCreateChat,
  onShowContactModal,
  onCreateGroup,
}: SidebarMenuProps) {
  const [isOpen, setShowMenu] = useState(false);
  
  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };
  const handleCreateChat = () => {
    onCreateChat();
    setShowMenu(false);
  };

  return (
    <div className="fixed bottom-6 right-6">
      <button
        onClick={toggleMenu}
        className={cn(
          "h-14 w-14 rounded-full",
          "flex items-center justify-center",
          "bg-muted hover:bg-muted/60",
          "transition-all duration-300 ease-in-out transform",
          isOpen && "rotate-180 shadow-lg shadow-lime-200"
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Edit2 className="h-5 w-5" />}
      </button>

      <div
        className={cn(
          "absolute bottom-16 right-0 w-48",
          "border bg-background/70 backdrop-blur-md rounded-lg shadow-xl",
          "z-20 overflow-hidden",
          "transform transition-all duration-300 ease-in-out origin-bottom-right",
          isOpen
            ? "scale-100 translate-y-0 opacity-100 pointer-events-auto"
            : "scale-75 translate-y-2 opacity-0 pointer-events-none"
        )}
      >
        <div className="p-1 space-y-1">
          <MenuItem
            icon={<Volume className="w-5 h-5" />}
            text="New Channel"
            onClick={() => {}}
            isFirst={true}
          />
          <MenuItem
            icon={<Users className="w-5 h-5" />}
            text="New Group"
            onClick={() => onCreateGroup()}
          />
          <MenuItem
            icon={<User className="w-5 h-5" />}
            text="New Private Chat"
            onClick={() => onShowContactModal()}
            isLast={true}
          />
        </div>
      </div>
    </div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const MenuItem = ({ icon, text, onClick, isFirst, isLast }: MenuItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-1.5",
        "hover:bg-muted active:bg-muted/80",
        "transition-colors duration-200",
        isFirst && "rounded-t-xl",
        isLast && "rounded-b-xl"
      )}
    >
      <div className="flex items-center justify-center">{icon}</div>
      <span className="text-sm">{text}</span>
    </button>
  );
};

export default SidebarMenu;
