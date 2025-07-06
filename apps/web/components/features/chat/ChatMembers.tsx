import { useMemo } from "react";
import { useSocket } from "@/providers/SocketProvider";
import { useChatStore } from "@/store/useChatStore";
import { useAppStore } from "@/store/useAppStore";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserMinus, Crown } from "lucide-react";
import { toast } from "sonner";
import useChat from "@/hooks/useChat";

interface ChatMembersProps {
  chatId: string;
}

const ChatMembers = ({ chatId }: ChatMembersProps) => {
  const { removeMember } = useSocket();
  const { chats } = useChat();
  const { user } = useAppStore();

  const chat = useMemo(() => {
    return chats.find((c) => c._id === chatId);
  }, [chats, chatId]);

  const currentUserId = user?.id || user?._id;

  const isAdmin = useMemo(() => {
    if (!chat || !currentUserId) return false;
    return chat.admin === currentUserId;
  }, [chat, currentUserId]);

  const handleRemoveMember = async (userId: string, username: string) => {
    try {
      await removeMember(chatId, userId);
      toast.success(`${username} removed from the chat`);
    } catch (error: any) {
      toast.error(error.message || "Failed to remove member");
    }
  };

  if (!chat) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Chat not found
      </div>
    );
  }

  const members = chat.participants || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Members</h3>
        <Badge variant="secondary" className="text-xs">
          {members.length} {members.length === 1 ? "member" : "members"}
        </Badge>
      </div>

      <div className="space-y-2">
        {members.map((participant) => {
          const member = participant.userId;
          const memberId = member._id || member.id;
          const isCurrentUser = memberId === currentUserId;
          const isChatAdmin = chat.admin === memberId;

          return (
            <div
              key={memberId}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <UserAvatar user={member} size="sm" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {member.username}
                      {isCurrentUser && " (You)"}
                    </span>
                    {isChatAdmin && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {member.email}
                  </span>
                </div>
              </div>

              {isAdmin && !isCurrentUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(memberId, member.username)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {members.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No members found</p>
        </div>
      )}
    </div>
  );
};

export default ChatMembers;
