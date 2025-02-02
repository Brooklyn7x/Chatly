import { cn } from "@/lib/utils";
import { ArrowLeft, Trash } from "lucide-react";
import { Input } from "../ui/input";
import { NavigationButton } from "./NavigationButton";
import { UserAvatar } from "../user/UserAvatar";

interface EditProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileForm({ isOpen, onClose }: EditProfileFormProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-background",
        "flex flex-col",
        "transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="border-b border-neutral-800 p-3">
        <div className="flex items-center gap-4">
          <NavigationButton icon={ArrowLeft} onClick={onClose} />
          <h1 className="text-lg font-mono">Edit</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center justify-center gap-6 p-4">
          <UserAvatar size={"xl"} />

          <div className="mt-2">
            <h1 className="text-xl text-center font-semibold">Shubh Babu</h1>
            <p className="text-center mt-1 text-sm text-muted-foreground">
              original name{" "}
            </p>
          </div>
        </div>

        <form className="p-4 flex flex-col gap-3 mt-6">
          <Input className="h-12" placeholder="First name" />
          <Input className="h-12" placeholder="Last name" />
        </form>

        <div className="p-4 mt-2 border-t">
          <button className="flex items-center gap-6 p-2 border w-full rounded-md px-4 py-3 text-red-600">
            <Trash className="h-5 w-5" />
            Delete Contact
          </button>
        </div>
      </div>
    </div>
  );
}
