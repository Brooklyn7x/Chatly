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

interface RemoveMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participants: Participant[];
  onRemove: (userId: string) => Promise<void>;
  removingUserId?: string | null;
}

const RemoveMemberDialog = ({
  open,
  onOpenChange,
  participants,
  onRemove,
  removingUserId,
}: RemoveMemberDialogProps) => {
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
        <div className="max-h-64 overflow-y-auto space-y-1">
          {participants.map((participant) => (
            <div
              key={participant.userId._id}
              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors"
            >
              <div className="flex items-center gap-3">
                <UserAvatar {...{ user: participant.userId, size: "sm" }} />
                <span className="text-sm">{participant.userId.username}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleRemove(participant.userId._id)}
                disabled={removingUserId === participant.userId._id}
                className="text-xs"
              >
                {removingUserId === participant.userId._id ? (
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
