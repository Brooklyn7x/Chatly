import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { UserAvatar } from "../user/UserAvatar";
import { Participant } from "@/types";
import { useState } from "react";
import { Input } from "../ui/input";
import { Loading } from "../ui/loading";

interface EditChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

export function EditChatDailog({ open, onOpenChange, onSubmit }: EditChatProps) {
  const [data, setData] = useState({
    groupName: "Data",
    groupDescription: "Descropt",
  });
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="p-4">
            <UserAvatar size={"xl"} />
          </div>
          <Input
            placeholder="Group Name"
            value={data.groupName}
            onChange={(e) => setData({ ...data, groupName: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={data.groupDescription}
            onChange={(e) =>
              setData({ ...data, groupDescription: e.target.value })
            }
          />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSubmit} disabled={isLoading}>
            {isLoading ? <Loading /> : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
