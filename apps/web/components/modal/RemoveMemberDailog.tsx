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

export const RemoveMemberDialog = ({
  open,
  onOpenChange,
  participants,
  onRemove,
  isRemoving,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participants: Participant[];
  onRemove: (userId: string) => Promise<void>;
  isRemoving?: boolean;
}) => {
  const handleRemove = (userId: string) => {
    onRemove(userId);
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
