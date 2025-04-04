import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Participant } from "@/types";
import { UserAvatar } from "../shared/UserAvatar";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useSocketStore } from "@/store/useSocketStore";
import { useChatStore } from "@/store/useChatStore";
import { toast } from "sonner";

interface RemoveMemberDialogProps {
  open: boolean;
  onOpenChange: () => void;
  participants: Participant[];
}

const RemoveMemberDialog = ({
  open,
  onOpenChange,
  participants,
}: RemoveMemberDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const { socket } = useSocketStore();
  const chatId = useChatStore((state) => state.activeChatId);

  const handleRemove = async (userId: string) => {
    setRemovingUserId(userId);
    setLoading(true);
    try {
      if (socket) {
        socket.emit(
          "conversation:removeParticipants",
          { conversationId: chatId, userId },
          (error: any) => {
            if (error) {
              toast.error(error.error || "Failed to remove the user");
            } else {
              toast.success("User removed successfully");
              onOpenChange();
            }
            setLoading(false);
            setRemovingUserId(null);
          }
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
      setLoading(false);
      setRemovingUserId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[500px] h-full flex flex-col">
        <DialogHeader>
          <DialogTitle>Remove User</DialogTitle>
          <DialogDescription>
            Select a user to remove from the group
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto space-y-1 text-left">
          {participants.map((participant) => (
            <div
              key={participant.userId._id}
              className="flex items-center justify-between border p-2 hover:bg-muted/50 rounded-md transition-colors"
            >
              <div className="flex items-center gap-3">
                <UserAvatar {...{ user: participant.userId, size: "sm" }} />
                <span className="text-sm">{participant.userId.username}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleRemove(participant.userId._id)}
                disabled={loading && removingUserId === participant.userId._id}
                className="text-xs"
              >
                {loading && removingUserId === participant.userId._id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Remove
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveMemberDialog;
