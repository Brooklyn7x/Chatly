import { Bookmark, Edit2, IconNode, Menu, Pin, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ChatSideBar() {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="w-full sm:w-[400px] flex-shrink-0 border-r flex flex-col relative">
      <div className="sticky top-0 z-10">
        <ChatSidebarHeader />
      </div>
      <div className="flex-1  overflow-y-auto">
        <ConversationList />
      </div>

      <div className="absolute bottom-6 right-6">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={cn(
            "h-14 w-14 text-center bg-slate-400/50 rounded-full flex items-center justify-center hover:bg-slate-500/80"
          )}
        >
          <Edit2 className="h-6 w-6" />
        </button>
      </div>

      {showMenu && (
        <div className="absolute bottom-20 mb-2 right-8 w-[200px] border bg-background/90 backdrop-blur-sm z-20 p-1 rounded-md">
          <button className="w-full flex items-center gap-4 px-4 py-1 hover:bg-slate-500/50 hover:rounded-md">
            <User className="h-4 w-4" />
            <span className="text-sm">New private chat</span>
          </button>
        </div>
      )}
    </div>
  );
}

function ChatSidebarHeader() {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="px-4 py-3 border-b relative">
      <div className="flex gap-2">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={cn(
            "hover:bg-slate-400/20 hover:rounded-full p-2",
            "transition-all duration-300 ease-in-out",
            showMenu && "bg-slate-400/50 rounded-full rotate-180"
          )}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Input />
      </div>

      {showMenu && (
        <div
          className={cn(
            "absolute mt-3 w-[250px] p-1 rounded-md z-20 shadow-md bg-background/80 border backdrop-blur-sm",
            "transition-all ease-out",
            showMenu
              ? "animate-[slideIn_0.3s_ease-out_forwards]"
              : "animate-[slideOut_0.3s_ease-in_forwards]"
          )}
        >
          {Array.from({ length: 4 }).map((item, index) => (
            <MenuItem label="Saved" />
          ))}
        </div>
      )}
    </div>
  );
}
interface MenuItemProps {
  onClick?: () => void;
  label?: string;
  icon?: IconNode;
}
function MenuItem({ onClick, label, icon }: MenuItemProps) {
  return (
    <button className="flex items-center gap-5 hover:bg-slate-500/40 w-full rounded-sm px-4 py-2 transition-colors">
      <Bookmark className="h-4 w-4" />
      <span className="text-sm">{label}</span>
    </button>
  );
}

function ConversationList() {
  const [activeConversation, setActiveConversation] = useState<number | null>(
    null
  );
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-2 ">
      {Array.from({ length: 30 }).map((_, index) => (
        <ConversationItem
          key={index}
          isActive={activeConversation === index}
          onClick={() => setActiveConversation(index)}
        />
      ))}
    </div>
  );
}
interface ConversationItemProps {
  isActive: boolean;
  onClick: () => void;
}

function ConversationItem({ isActive, onClick }: ConversationItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between w-full p-2 hover:bg-slate-100/20 hover:rounded-md cursor-pointer",
        isActive && "bg-slate-500/30 rounded-md"
      )}
    >
      <div className="flex  gap-2">
        <div className="relative h-14 w-14 overflow-hidden rounded-full">
          <Image
            src="/user.png"
            alt="user"
            className="object-cover"
            fill
            sizes="128px"
            priority
          />
        </div>
        <div>
          <p className="text-md font-semibold">UserName</p>
          <p className="text-sm">Last Message.png</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <p className="text-xs"> 12:34 PM</p>
        {/* <span className="">
          <Pin className="h-4 w-4" />
        </span> */}
        <span className="py-0.5 px-0.5 text-xs min-w-[20px] text-center rounded-full bg-slate-400">
          4
        </span>
      </div>
    </div>
  );
}
