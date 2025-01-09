import { cn } from "@/lib/utils";
import { X, Pencil, Phone, Bell, Link, LucideIcon } from "lucide-react";
import { useState } from "react";
import { EditProfileForm } from "./ProfileForm";
import { Chat } from "@/types";
import { UserItem } from "../sidebar/UserItem";
import { UserAvatar } from "../user/UserAvatar";

interface UserProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  chat: Chat | undefined;
}

export function UserProfilePanel({
  isOpen,
  onClose,
  chat,
}: UserProfilePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const onEdit = () => {
    setIsEditing((prev) => !prev);
  };
  const isGroupChat = chat?.type === "group";
  const displayName = isGroupChat
    ? chat?.metadata.title
    : chat?.participants[0]?.username || "User";
  const memberCount = chat?.participants.length || 0;
  const statusText = isGroupChat
    ? `${memberCount} members`
    : "last seen recently";
  if (!isOpen) return null;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 right-0 w-full sm:w-[400px] bg-background sm:border shadow-md",
        "flex flex-col",
        "transition-transform transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="h-16 px-4 flex-none border-b flex items-center justify-between text-muted-foreground">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className={cn(
              "h-10 w-10 p-2 flex items-center justify-center rounded-full",
              "hover:bg-muted/50 transition-colors duration-200"
            )}
          >
            <X className="h-5 w-5" />
          </button>
          <h1 className="text-lg">{chat?.metadata.title || "Direct"}</h1>
        </div>

        <button
          onClick={onEdit}
          className={cn(
            "h-10 w-10 p-2 flex items-center justify-center rounded-full",
            "hover:bg-muted/50 transition-colors duration-200"
          )}
        >
          <Pencil className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <section className="flex flex-col items-center justify-center gap-4 p-4">
          <UserAvatar size={"xl"} />
          <div className="mt-2 text-center">
            <h1 className="text-xl font-semibold">{displayName}</h1>
            <p className="text-center text-sm text-muted-foreground">
              {statusText}
            </p>
          </div>
        </section>

        <section className="p-4">
          {chat?.type === "direct" ? (
            <ProfileInfo icon={Phone} label="Phone" value="+1234567889" />
          ) : (
            <ProfileInfo
              icon={Link}
              label="Link"
              value={chat?.metadata.title || "No link attached"}
            />
          )}

          <ProfileInfo icon={Bell} label="Notifications" value="Enabled" />
        </section>
      </div>

      <section className="flex-1 overflow-y-auto border-t">
        <h1 className="p-4 text-lg font-semibold">
          {chat?.type === "direct" ? "Members" : "Shared Groups"}
        </h1>

        <div className="space-y-1">
          {chat?.participants.map((participant) => (
            <UserItem key={participant._id} user={participant} />
          ))}
        </div>
        
      </section>

      {isEditing && (
        <EditProfileForm
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
        />
      )}
    </aside>
  );
}

interface ProfileInfoProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const ProfileInfo = ({ icon: Icon, label, value }: ProfileInfoProps) => {
  return (
    <div className="flex items-center gap-6 p-4">
      <Icon className="h-6 w-6 text-muted-foreground" />
      <div className="flex flex-col">
        <span>{value}</span>
        <span className="text-muted-foreground text-sm">{label}</span>
      </div>
    </div>
  );
};
