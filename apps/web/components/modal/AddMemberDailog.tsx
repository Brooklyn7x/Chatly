import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { UserPlus, X, Loader2, Plus } from "lucide-react";
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
import { UserAvatar } from "../shared/UserAvatar";
import { useFetchContacts } from "@/hooks/user/useContact";
import { Participant } from "@/types";
import { useSocketStore } from "@/store/useSocketStore";

interface AddMemberDailogProps {
  chatId: string;
  participants: Participant;
}
const AddMemberDialog = ({ chatId, participants }: AddMemberDailogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string[]>([]);
  const { contacts } = useFetchContacts();
  const { socket } = useSocketStore();

  const handleUserSelection = (userId: string) => {
    setSelectedMember((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddMember = useCallback(async () => {
    if (selectedMember.length === 0) {
      toast.error("Please select at least one member to add");
      return;
    }

    try {
      const formattedParticipants = selectedMember.map((userId) => ({
        userId,
      }));
      const addMember = {
        conversationId: chatId,
        participants: formattedParticipants,
      };
      setLoading(true);
      socket?.emit("conversation:addParticipants", addMember, (error: any) => {
        if (error) {
          toast.error(error.error || "Failed to add members");
        } else {
          toast.success("Members added successfully");
          setOpen(false);
        }
        setLoading(false);
      });
    } catch (error) {
      toast.error("Failed to add members");
      setLoading(false);
    }
  }, [selectedMember]);

  const renderSelectedUsers = () => {
    const selectedUsers = selectedMember.map((userId) => {
      const user = contacts.find((contact: any) => contact._id === userId);
      return { id: userId, username: user?.username || "Unknown" };
    });

    return (
      <div className="flex flex-wrap gap-2 p-2 bg-muted/20 rounded-lg">
        {selectedUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm"
          >
            <span>{user.username}</span>
            <button
              onClick={() => handleUserSelection(user.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderAvailableUsers = () => (
    <div className="space-y-2 p-2 bg-muted/20 rounded-lg">
      {contacts.map((user: any) => (
        <div
          key={user.id}
          onClick={() => handleUserSelection(user._id)}
          className={cn(
            "p-3 rounded-md cursor-pointer transition-colors",
            selectedMember.includes(user._id) ? "bg-muted" : "hover:bg-muted/50"
          )}
        >
          <div className="flex items-center gap-3">
            <UserAvatar size="sm" />
            <span className="text-sm">{user.username}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 rounded-md text-xs">
          <Plus size={14} className="mr-1" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>Add Member to Group</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="mb-2 text-sm font-medium">
              Selected Users ({selectedMember.length})
            </h1>
            {renderSelectedUsers()}
          </div>
          <div className="max-h-80 h-full overflow-y-auto">
            {renderAvailableUsers()}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleAddMember}
            disabled={loading}
            className="w-full"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Adding..." : "Add Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
