import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Loader2, Pencil } from "lucide-react";
import { Input } from "../ui/input";
import { UserAvatar } from "../shared/UserAvatar";

interface EditChatProps {
  title: string;
  description: string;
}

export function EditChatInfo({ title, description }: EditChatProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    groupTitle: title,
    groupDescription: description,
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 200));
      console.log(data)
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="h-9 w-9 p-4">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="sr-only">Chat Info</DialogTitle>
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
