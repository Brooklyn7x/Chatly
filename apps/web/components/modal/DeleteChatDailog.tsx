import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useSocketStore } from "@/store/useSocketStore";
import { useChatStore } from "@/store/useChatStore";
import { useChatPanelStore } from "@/store/useChatPanelStore";
import { Loader2 } from "lucide-react";

interface DeleteChatProps {
  chatId: string;
}

const DeleteChatDailog = ({ chatId }: DeleteChatProps) => {
  const [open, setOpen] = useState(false);
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
        } else {
          setActiveChat(null);
          setIsOpen(false);
          toast.success("Chat deleted successfully");
        }
        setOpen(false);
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 rounded-md text-xs text-red-500 hover:bg-red-500/10 hover:text-red-600"
        >
          Delete
        </Button>
      </DialogTrigger>
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
            onClick={() => setOpen(false)}
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
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChatDailog;
