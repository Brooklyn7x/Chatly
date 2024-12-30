import { cn } from "@/lib/utils";
import { ArrowLeft, Trash } from "lucide-react";
import { Input } from "../ui/input";
import Image from "next/image";

interface EditProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileForm({ isOpen, onClose }: EditProfileFormProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-background",
        "transition-transform duration-300 ease-in-out",
        "flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex-none border-b px-4 py-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onClose()}
            className="p-2 rounded-full hover:bg-slate-50/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <h1 className="text-lg font-mono">Edit</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="h-32 w-32 rounded-full border relative translate-y-5 overflow-hidden ">
            <Image
              src={"/user.png"}
              alt="user"
              fill
              className="object-cover"
              layout="lazy"
              sizes="100px"
            />
          </div>

          <div className="mt-2">
            <h1 className="text-xl font-semibold">Shubh Babu</h1>
            <p className="text-center mt-2 text-sm text-muted-foreground">
              original name{" "}
            </p>
          </div>
        </div>

        <form className="flex flex-col gap-6 mt-6">
          <Input className="h-12" placeholder="First name" />

          <Input className="h-12" placeholder="Last name" />
        </form>

        <div className="mt-4">
          <button className="flex items-center gap-6 p-2 border w-full rounded-md px-4 py-3 text-red-600">
            <Trash className="h-5 w-5" />
            Delete Contact
          </button>
        </div>
      </div>
    </div>
  );
}
