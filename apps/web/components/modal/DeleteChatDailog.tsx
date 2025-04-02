import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useSocketStore } from "@/store/useSocketStore";
import { useChatStore } from "@/store/useChatStore";
import { useChatPanelStore } from "@/store/useChatPanelStore";

interface DeleteChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatId: string;
}

const DeleteChatDailog = ({ open, onOpenChange, chatId }: DeleteChatProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { socket } = useSocketStore();
  const { setActiveChat } = useChatStore();
  const { setIsOpen } = useChatPanelStore();

  const handleDelete = async () => {
    setIsDeleting(true);
    socket?.emit(
      "conversation:delete",
      { conversationId: chatId },
      (error: any) => {
        setIsDeleting(false);
        if (error) {
          toast.error(error.error || "Failed to delete the conversation");
          onOpenChange(false);
        } else {
          setActiveChat(null);
          setIsOpen(false);
          toast.success("Conversation deleted successfully");
          onOpenChange(false);
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Chat</DialogTitle>
          <DialogDescription className="text-sm">
            This action cannot be undone. All messages and media will be
            permanently removed.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="text-sm"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-sm"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChatDailog;
