import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

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
  isLoading?: boolean;
}

export function EditChatDailog({
  title,
  description,
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: EditChatProps) {
  const [data, setData] = useState({
    groupTitle: title,
    groupDescription: description,
  });

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
            <UserAvatar size="xl" />
          </div>
          <Input
            placeholder="Group Name"
            value={data.groupTitle}
            onChange={(e) => setData({ ...data, groupTitle: e.target.value })}
            className="text-sm"
          />
          <Input
            placeholder="Description"
            value={data.groupDescription}
            onChange={(e) =>
              setData({ ...data, groupDescription: e.target.value })
            }
            className="text-sm"
          />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="text-sm"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
