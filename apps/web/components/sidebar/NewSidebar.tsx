"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  ChevronDown,
  MessageCircle,
  Users,
  Lock,
  Video,
  FileText,
  Star,
  Hash,
  MoreVertical,
  Pin,
  Archive,
  Trash,
  UserPlus,
  BellOff,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const chats = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Hey, how are you?",
    timestamp: "2h ago",
    unread: 1,
  },
  {
    id: 2,
    name: "Work Team",
    lastMessage: "Let's meet at 3 PM",
    timestamp: "Yesterday",
    unread: 0,
  },
  // Add more chats here
];

const ChatSidebar = () => {
  return (
    <div className="h-screen w-80 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">Chats</h2>
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Star className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Mark all as read</p>
          </TooltipContent>
        </Tooltip> */}
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search chats..." className="pl-10" />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center gap-3 p-3 hover:bg-secondary/50 rounded-lg transition-colors cursor-pointer group"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={chat.avatar} />
              <AvatarFallback>{chat.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{chat.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {chat.lastMessage}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <span className="text-xs text-muted-foreground">
                {chat.timestamp}
              </span>
              {chat.unread > 0 && (
                <Badge variant="default" className="h-5 w-5 justify-center p-0">
                  {chat.unread}
                </Badge>
              )}
            </div>

            {/* Chat Options Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem className="flex items-center gap-3">
                  <Pin className="h-4 w-4" />
                  <span>Pin Chat</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3">
                  <X className="h-4 w-4" />
                  <span>Mute Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3">
                  <Archive className="h-4 w-4" />
                  <span>Archive Chat</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3">
                  <UserPlus className="h-4 w-4" />
                  <span>Add People</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-3 text-red-500">
                  <Trash className="h-4 w-4" />
                  <span>Delete Chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {/* New Chat Button with Enhanced Dropdown */}
      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full gap-2" variant="outline">
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
              <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuItem
              className="flex items-center gap-3 p-3"
              onClick={() => console.log("Create Direct Message")}
            >
              <MessageCircle className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Direct Message</p>
                <p className="text-xs text-muted-foreground">
                  Start a private conversation
                </p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-3 p-3"
              onClick={() => console.log("Create Group Chat")}
            >
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Group Chat</p>
                <p className="text-xs text-muted-foreground">
                  Create a group with multiple people
                </p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-3 p-3"
              onClick={() => console.log("Create Private Channel")}
            >
              <Lock className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Private Channel</p>
                <p className="text-xs text-muted-foreground">
                  Create an invite-only channel
                </p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex items-center gap-3 p-3"
              onClick={() => console.log("Start Video Call")}
            >
              <Video className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Video Call</p>
                <p className="text-xs text-muted-foreground">
                  Start a video meeting
                </p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-3 p-3"
              onClick={() => console.log("Create Document")}
            >
              <FileText className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Collaborative Document</p>
                <p className="text-xs text-muted-foreground">
                  Create and edit together
                </p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-3 p-3"
              onClick={() => console.log("Create Channel")}
            >
              <Hash className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Public Channel</p>
                <p className="text-xs text-muted-foreground">
                  Create a public discussion space
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatSidebar;
