import { useMemo, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { UserPlus, X } from "lucide-react";
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
import { Loading } from "../ui/loading";
import { UserAvatar } from "../shared/UserAvatar";
import useAuthStore from "@/store/useAuthStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchUser } from "@/hooks/useContact";

const AddMemberDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const { user: current } = useAuthStore();
  const [selectedMember, setSelectedMember] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const debounceQuery = useDebounce(query, 100);
  const { users, isLoading } = useSearchUser(debounceQuery);

  const availableUsers = useMemo(() => {
    return users.filter((user: any) => {
      const isNotCurrentUser = user._id !== current?._id;
      // const isNotParticipant = !participants?.some(
      //   (participant: any) => participant.userId === user._id
      // );
      // const isNotSelected = !selectedMember.includes(user._id);
      // return isNotCurrentUser && isNotParticipant && isNotSelected;
    });
  }, [users, current, selectedMember]);

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
      // onAdd(selectedMember);
      setSelectedMember([]);
    } catch (error) {
      toast.error("Failed to add members");
    }
  }, [selectedMember]);

  const renderSelectedUsers = () => (
    <div className="flex flex-wrap gap-2">
      {selectedMember.map((id) => (
        <div
          key={id}
          className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm"
        >
          <span>{id}</span>
          <button
            onClick={() => handleUserSelection(id)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );

  const renderAvailableUsers = () => (
    <div className="space-y-1">
      {availableUsers.map((user: any) => (
        <div
          key={user.id}
          onClick={() => handleUserSelection(user._id)}
          className={cn(
            "p-2 rounded-md cursor-pointer transition-colors",
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
        <Button variant="ghost" size="icon" className="border h-14 w-14">
          <UserPlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>Add Member to Group</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="p-2">
            <h1 className="mb-2 text-sm font-medium">
              Selected Users ({selectedMember.length})
            </h1>
            {renderSelectedUsers()}
          </div>
          <div className="min-h-64 max-h-64 p-2 border rounded-lg overflow-y-auto">
            {renderAvailableUsers()}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddMember} disabled={loading}>
            {loading ? <Loading /> : "Add Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
