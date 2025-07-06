import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Phone,
  Video,
  Search,
  Info,
  Trash2,
} from "lucide-react";
import { Chat } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { UserAvatar } from "@/components/common/UserAvatar";
import {
  CustomDropdown,
  CustomDropdownItem,
  CustomDropdownSeparator,
} from "@/components/ui/custom-dropdown";


interface ChatHeaderProps {
  chat: Chat;
}

const ChatHeader = ({ chat }: ChatHeaderProps) => {
  const { user, openModal } = useAppStore();


  const chatName = useMemo(() => {
    if (chat.type === "group") {
      return chat.name || "Group Chat";
    } else {
      // For private chats, show the other participant's name
      const otherParticipant = chat.participants?.find(
        (p) => p.userId._id !== user?.id && p.userId._id !== user?._id
      );
      return otherParticipant?.userId.username || "Unknown User";
    }
  }, [chat, user]);

  const participantCount = chat.participants?.length || 0;
  const isOnline = true; // You can implement online status logic here

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <UserAvatar
          user={chat.participants?.[0]?.userId}
          size="md"
          className="flex-shrink-0"
        />
        <div className="flex flex-col">
          <h2 className="font-semibold text-lg">{chatName}</h2>
          <div className="flex items-center gap-2">
            {chat.type === "group" ? (
              <span className="text-sm text-muted-foreground">
                {participantCount} members
              </span>
            ) : (
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span className="text-sm text-muted-foreground">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Video className="h-4 w-4" />
        </Button>

        <CustomDropdown
          className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border w-[150px]"
          trigger={
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }
          align="end"
        >
          <CustomDropdownItem onClick={() => openModal("chatPanel")}>
            <Info className="h-4 w-4" />
            Chat Info
          </CustomDropdownItem>

          <CustomDropdownItem>
            <Search className="h-4 w-4" />
            Search Messages
          </CustomDropdownItem>

          <CustomDropdownSeparator />

          <CustomDropdownItem className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
            Delete Chat
          </CustomDropdownItem>
        </CustomDropdown>
      </div>
    </div>
  );
};

export default ChatHeader;
