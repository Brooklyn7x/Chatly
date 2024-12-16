import {
  Bookmark,
  Edit2,
  IconNode,
  Menu,
  Pin,
  Search,
  User,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Chat, useChatStore } from "@/store/useChatStore";

export default function SideBar() {
  const { sidebarOpen } = useChatStore();
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div
      className={cn(
        `w-full sm:w-[400px] flex-shrink-0 border-r flex flex-col relative`,
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        "transition-transform duration-200 ease-in-out"
      )}
    >
      <ChatHeader />
      <div className="flex-1 overflow-y-auto">
        <ChatList />
      </div>
      <div className="absolute bottom-6 right-6">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={cn(
            "h-14 w-14 text-center bg-muted/80 rounded-full flex items-center justify-center hover:bg-slate-500/80"
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

function ChatHeader() {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="px-4 py-2 border-b">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={cn(
            "hover:bg-muted/60 hover:rounded-full p-2",
            "transition-all duration-300 ease-in-out",
            showMenu && "bg-muted/80 rounded-full rotate-180"
          )}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <input
            className="w-full pl-12 pr-4 py-2 bg-muted/50 rounded-lg border text-md outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search"
          />
        </div>
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
            <MenuItem label="Saved Message" />
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
    <button className="flex items-center gap-5 hover:bg-muted/80 w-full rounded-sm px-4 py-2 transition-colors">
      <Bookmark className="h-4 w-4" />
      <span className="text-sm">{label}</span>
    </button>
  );
}

function ChatList() {
  const { chats, selectedChatId, selectChat } = useChatStore();
  return (
    <div className="divide-y">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          isActive={selectedChatId === chat.id}
          onClick={() => selectChat(chat.id)}
          chat={chat}
        />
      ))}
    </div>
  );
}
interface ChatItemProps {
  isActive: boolean;
  onClick: () => void;
  chat: Chat;
}

function ChatItem({ isActive, onClick, chat }: ChatItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-2 cursor-pointer transition-colors",
        isActive && "bg-muted/60",
        "hover:bg-muted/30"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage />
            <AvatarFallback>Cn</AvatarFallback>
          </Avatar>
          {chat.participants[0]?.status === "online" && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <h3 className="font-medium truncate text-md">
              {chat.participants[0]?.name}
            </h3>
            <span className="text-xs text-muted-foreground">{"10 Dec"}</span>
          </div>

          <div className="flex justify-between items-baseline mt-1">
            <p className="text-sm text-muted-foreground truncate">
              {chat.lastMessage?.content}
            </p>
            <span className="ml-2 bg-primary text-primary-foreground rounded-full text-xs h-5 w-5 flex items-center justify-center ">
              {chat.unreadCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
