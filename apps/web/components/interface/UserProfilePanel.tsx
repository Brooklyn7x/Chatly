import { cn } from "@/lib/utils";
import { X, Pencil, Phone, Bell } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { EditProfileForm } from "./ProfileForm";

interface UserProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfilePanel({ isOpen, onClose }: UserProfilePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  if (!isOpen) return null;
  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 w-full sm:w-[400px] bg-background sm:border shadow-md",
        "transition-transform duration-300 ease-in-out",
        "flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="h-16 px-4 flex-none border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <h1 className="text-lg">User Info</h1>
        </div>

        <button onClick={() => setIsEditing(true)}>
          <Pencil className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="h-32 w-32 rounded-full border relative translate-y-5 overflow-hidden">
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
              last seen recently when?
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-6 p-4">
            <Phone className="text-muted-foreground" />
            <p className="flex flex-col mt-0">
              +9012344354{" "}
              <span className="text-muted-foreground text-sm">Phone</span>{" "}
            </p>
          </div>
          <p className="flex items-center gap-6 p-4">
            <Bell className="text-muted-foreground" />
            <span>Notifications</span>
          </p>
        </div>
      </div>

      {isEditing && (
        <EditProfileForm
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}
