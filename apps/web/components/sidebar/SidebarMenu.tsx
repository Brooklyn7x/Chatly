import { useState } from "react";
import { Edit2, User, Users, Volume, X } from "lucide-react";
import React from "react";

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
  const [showMenu, setShowMenu] = useState(false);
  
  const handleCreateChat = () => {
    onCreateChat();
    setShowMenu(false);
  };

  return (
    <div className="fixed bottom-6 right-6">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`h-14 w-14 text-center bg-muted rounded-full flex items-center justify-center 
          hover:bg-muted/60 transition-all duration-300 ease-in-out transform
          ${showMenu ? "rotate-180 shadow-lg" : "rotate-0"}`}
      >
        {showMenu ? <X className="h-6 w-6" /> : <Edit2 className="h-5 w-5" />}
      </button>

      <div
        className={`absolute bottom-16 right-0 w-48 border bg-background z-20 rounded-lg shadow-xl
          transform transition-all duration-300 ease-in-out origin-bottom-right
          ${
            showMenu
              ? "scale-100 translate-y-0 opacity-100 pointer-events-auto"
              : "scale-75 translate-y-2 opacity-0 pointer-events-none"
          }`}
      >
        <div className="p-1 space-y-1">
          <MenuItem
            icon={<Volume className="w-4 h-4" />}
            text="New Channel"
            onClick={() => {}}
            isFirst={true}
          />
          <MenuItem
            icon={<Users className="w-4 h-4" />}
            text="New Group"
            onClick={() => onCreateGroup()}
          />
          <MenuItem
            icon={<User className="w-4 h-4" />}
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
      className={`w-full flex items-center gap-3 px-4 py-3
        hover:bg-muted transition-colors duration-200
        ${isFirst ? "rounded-t-lg" : ""}
        ${isLast ? "rounded-b-lg" : ""}`}
    >
      <div className="flex items-center justify-center w-5 h-5 ">{icon}</div>
      <span className="text-sm">{text}</span>
    </button>
  );
};

export default SidebarMenu;
