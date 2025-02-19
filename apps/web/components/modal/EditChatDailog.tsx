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
import { Input } from "../ui/input";
import { Loading } from "../ui/loading";
import { UserAvatar } from "../shared/UserAvatar";

interface EditChatProps {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function EditChatDailog({
  title,
  description,
  open,
  onOpenChange,
  onSubmit,
}: EditChatProps) {
  const [data, setData] = useState({
    groupTitle: title,
    groupDescription: description,
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = () => {
    onSubmit(data);
  };
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
            value={data.groupTitle}
            onChange={(e) => setData({ ...data, groupTitle: e.target.value })}
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
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Loading /> : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
