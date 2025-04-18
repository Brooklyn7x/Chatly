import { Button } from "@/components/ui/button";
import { Chat } from "@/types";
import { MoreVertical } from "lucide-react";
import { ChatAvatar } from "../common/ChatAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useSocketStore } from "@/store/useSocketStore";
import { toast } from "sonner";

interface ChatMembersProps {
  chat: Chat;
}

const ChatMembers = ({ chat }: ChatMembersProps) => {
  const [loading, setLoading] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const { socket } = useSocketStore();

  const handleRemoveUser = async (userId: string) => {
    setRemovingUserId(userId);
    setLoading(true);
    try {
      if (socket) {
        socket.emit(
          "conversation:removeParticipants",
          { conversationId: chat._id, userId },
          (error: any) => {
            if (error) {
              toast.error(error.error || "Failed to remove the user");
            } else {
              toast.success("User removed successfully");
            }
            setLoading(false);
            setRemovingUserId(null);
          }
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      setLoading(false);
      setRemovingUserId(null);
    }
  };
  return (
    <div className="p-5 border-t">
      <h4 className="text-sm font-medium mb-4 text-muted-foreground">
        Participants
      </h4>
      <div className="space-y-3">
        {chat.participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between group hover:bg-muted/50 p-2 rounded-md transition-colors"
          >
            <div className="flex items-center gap-3">
              <ChatAvatar chat={chat} />
              <div>
                <span className="text-sm font-medium block">
                  {participant.userId.username}
                </span>

                {participant.role === "admin" && (
                  <span className="text-muted-foreground text-sm">Admin</span>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical size={14} className="text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleRemoveUser(participant.userId._id)}
                >
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMembers;
