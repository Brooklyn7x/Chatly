import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useSearchUser } from "@/hooks/useSearchUser";
import { UserAvatar } from "../shared/UserAvatar";
import useAuthStore from "@/store/useAuthStore";
import { Participant } from "@/types";
import { toast } from "sonner";

interface AddMemberProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (userId: string[]) => void;
  participants: Participant[];
}

export const AddMemberDailog = ({
  open,
  onOpenChange,
  onAdd,
  participants,
}: AddMemberProps) => {
  const { user: current } = useAuthStore();
  const [selectedMember, setSelectedMember] = useState<string[]>([]);
  const { users } = useSearchUser("");
  const availableUsers = users.filter((user) => {
    const isNotCurrentUser = user._id !== current?._id;
    const isNotParticipant = !participants.some(
      (participant) => participant.userId === user._id
    );
    const isNotSelected = !selectedMember.includes(user._id);
    return isNotCurrentUser && isNotParticipant && isNotSelected;
  });

  const handleAddMember = () => {
    if (selectedMember.length === 0) {
      toast.error("Please select at least one member to add");
      return;
    }

    try {
      onAdd(selectedMember);
      setSelectedMember([]);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to add members");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>Add Member to Group</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="p-2">
            <h1 className="mb-2 text-sm font-medium">
              Selected Users ({selectedMember.length})
            </h1>
            <div className="flex flex-wrap gap-2">
              {selectedMember.map((id) => (
                <div
                  key={id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm"
                >
                  <span>{id}</span>
                  <button
                    onClick={() =>
                      setSelectedMember((prev) => prev.filter((i) => i !== id))
                    }
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="min-h-64 max-h-64 p-2 border rounded-lg overflow-y-auto">
            <div className="space-y-1">
              {availableUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() =>
                    setSelectedMember((prev) =>
                      prev.includes(user._id)
                        ? prev.filter((id) => id !== user._id)
                        : [...prev, user._id]
                    )
                  }
                  className={cn(
                    "p-2 rounded-md cursor-pointer transition-colors",
                    selectedMember.includes(user._id)
                      ? "bg-muted"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <UserAvatar size="sm" />
                    <span className="text-sm">{user.username}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddMember}>
            Add member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
