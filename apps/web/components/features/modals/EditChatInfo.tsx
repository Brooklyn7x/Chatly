import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSocketStore } from "@/store/useSocketStore";
import { useChatStore } from "@/store/useChatStore";
import { toast } from "sonner";

interface EditChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  descriptions: string;
}

export function EditChatInfo({
  open,
  onOpenChange,
  title,
  descriptions,
}: EditChatProps) {
  const activeChatId = useChatStore((state) => state.activeChatId);
  const { socket } = useSocketStore();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    groupTitle: title,
    groupDescription: descriptions,
  });

  const handleSubmit = async () => {
    if (!socket) return;
    try {
      setLoading(true);
      const updateData = {
        conversationId: activeChatId,
        name: data.groupTitle,
        description: data.groupDescription,
      };
      socket?.emit("conversation:update", updateData, (error: any) => {
        if (error) {
          toast.error(error.error);
        } else {
          toast.success("Updated");
          onOpenChange(false);
        }
      });

      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="">Update Info</DialogTitle>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="p-4">{/* <UserAvatar size="xl" /> */}</div>
          <Input
            placeholder="Group Name"
            value={data.groupTitle}
            onChange={(e: any) =>
              setData({ ...data, groupTitle: e.target.value })
            }
            className="text-sm"
          />
          <Input
            placeholder="Description"
            value={data.groupDescription}
            onChange={(e: any) =>
              setData({ ...data, groupDescription: e.target.value })
            }
            className="text-sm"
          />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} className="text-sm">
            {loading ? (
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

export default EditChatInfo;
