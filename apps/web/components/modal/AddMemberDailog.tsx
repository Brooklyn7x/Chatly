import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { UserAvatar } from "../user/UserAvatar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface AddMemberProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: () => void;
}

const mockUsers = [
  { _id: "1", username: "User 1" },
  { _id: "2", username: "User 2" },
  { _id: "3", username: "User 3" },
  { _id: "4", username: "User 1" },
  { _id: "5", username: "User 2" },
  { _id: "6", username: "User 3" },
  { _id: "7", username: "User 1" },
  { _id: "8", username: "User 2" },
  { _id: "9", username: "User 3" },
];

export const AddMemberDailog = ({ open, onOpenChange }: AddMemberProps) => {
  const [selectedMember, setSelectedMember] = useState([]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>Add Member to Group</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <div className="p-2">
            <h1 className="mb-2">Selected Users ({selectedMember.length})</h1>
            <div className="flex flex-wrap gap-2">
              {mockUsers
                .filter((user) => selectedMember.includes(user._id))
                .map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full"
                  >
                    <span>{user.username}</span>
                    <button
                      onClick={() =>
                        setSelectedMember((prev) =>
                          prev.filter((id) => id !== user._id)
                        )
                      }
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
          <div className="min-h-64 max-h-64 p-2 border rounded-xl overflow-y-auto">
            <div className="space-y-2">
              {mockUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() =>
                    setSelectedMember((prev) =>
                      prev.includes(user._id)
                        ? prev.filter((id) => id !== user._id)
                        : [...prev, user._id]
                    )
                  }
                  className={cn(
                    "p-2 rounded-lg cursor-pointer transition-colors",
                    selectedMember.includes(user._id)
                      ? "bg-muted"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} size="sm" />
                    <span>{user.username}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onsubmit}>
            Add member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
