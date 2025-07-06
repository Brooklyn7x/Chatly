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
import { Loader2, UserMinus } from "lucide-react";

interface RemoveMemberProps {
  chatId: string;
  userId: string;
  username: string;
}

const RemoveMemberDialog = ({
  chatId,
  userId,
  username,
}: RemoveMemberProps) => {
  const [open, setOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { removeMember } = useSocket();

  const handleRemoveMember = async () => {
    setIsRemoving(true);
    try {
      await removeMember(chatId, userId);
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to remove member");
    } finally {
      setIsRemoving(false);
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
          <UserMinus className="mr-2 h-4 w-4" />
          Remove
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove Member</DialogTitle>
          <DialogDescription className="text-sm">
            Are you sure you want to remove {username} from this conversation?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isRemoving}
            className="text-sm"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemoveMember}
            disabled={isRemoving}
            className="text-sm"
          >
            {isRemoving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isRemoving ? "Removing..." : "Remove Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveMemberDialog;
