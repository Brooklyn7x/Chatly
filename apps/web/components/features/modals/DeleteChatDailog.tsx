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
import { Button } from "@/components/ui/button";
import { useSocket } from "@/providers/SocketProvider";
import { useChatStore } from "@/store/useChatStore";
import { Loader2 } from "lucide-react";

interface DeleteChatProps {
  chatId: string;
}

const DeleteChatDailog = ({ chatId }: DeleteChatProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteChat } = useSocket();
  const { setActiveChat } = useChatStore();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteChat(chatId);
      setActiveChat(null);
      toast.success("Chat deleted successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete the conversation");
    } finally {
      setIsDeleting(false);
    }
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
