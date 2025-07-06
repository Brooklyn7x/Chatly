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
import { Loader2, UserPlus } from "lucide-react";
import { User } from "@/types";

interface AddMemberProps {
  chatId: string;
  availableUsers: User[];
  onClose: () => void;
}

const AddMemberDialog = ({ chatId, availableUsers, onClose }: AddMemberProps) => {
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);
  const { addMember } = useSocket();

  const handleAddMember = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user to add");
      return;
    }

    setIsAdding(true);
    try {
      await addMember(chatId, selectedUserId);
      setOpen(false);
      setSelectedUserId("");
    } catch (error: any) {
      toast.error(error.message || "Failed to add member");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 rounded-md text-xs hover:bg-primary/10 hover:text-primary"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription className="text-sm">
            Select a user to add to this conversation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full p-2 border rounded-md"
            disabled={isAdding}
            aria-label="Select user to add"
          >
            <option value="">Select a user...</option>
            {availableUsers.map((user) => (
              <option key={user._id || user.id} value={user._id || user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isAdding}
            className="text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddMember}
            disabled={isAdding || !selectedUserId}
            className="text-sm"
          >
            {isAdding ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isAdding ? "Adding..." : "Add Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
