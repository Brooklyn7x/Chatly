import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { UserAvatar } from "../user/UserAvatar";
import { Participant } from "@/types";
import { useState } from "react";

export const RemoveMemberDialog = ({
  open,
  onOpenChange,
  participants,
  onRemove,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participants: Participant[];
  onRemove: (userId: string) => Promise<void>;
}) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async (userId: string) => {
    try {
      setIsRemoving(true);
      await onRemove(userId);
      onOpenChange(false);
      toast.success("User removed successfully");
    } catch (error) {
      toast.error("Failed to remove user");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove User</DialogTitle>
          <DialogDescription>
            Select a user to remove from the group
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-64 overflow-y-auto">
          {participants.map((participant) => (
            <div
              key={participant.userId._id}
              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <UserAvatar user={participant.userId} size="sm" />
                <span>{participant.userId.username}</span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemove(participant.userId._id)}
                disabled={isRemoving}
              >
                {isRemoving ? "Removing..." : "Remove"}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
