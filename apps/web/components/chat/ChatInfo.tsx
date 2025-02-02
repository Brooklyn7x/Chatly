import { cn } from "@/lib/utils";
import {
  X,
  Pencil,
  Phone,
  Bell,
  Link,
  LucideIcon,
  BlocksIcon,
  Trash,
} from "lucide-react";
import { useMemo, useState } from "react";
import { EditProfileForm } from "../shared/ProfileForm";
import { Chat } from "@/types";
import { UserItem } from "../sidebar/UserItem";
import { UserAvatar } from "../user/UserAvatar";

interface UserProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  chat: Chat | undefined;
}

export function ChatInfo({ isOpen, onClose, chat }: UserProfilePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const onEdit = () => {
    setIsEditing((prev) => !prev);
  };
  const isGroupChat = chat?.type === "group";

  const displayName = useMemo(() => {
    if (chat.type === "direct") {
      return chat.participants[1]?.userId.username || "Direct Message";
    }
    return chat.metadata?.title || "Group Chat";
  }, [chat]);

  const memberCount = chat?.participants.length || 0;
  const statusText = isGroupChat
    ? `${memberCount} members`
    : "last seen recently";
  if (!isOpen) return null;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 right-0 w-full sm:w-[400px] bg-background/70 backdrop-blur-md  sm:border-l shadow-md",
        "flex flex-col",
        "transition-transform transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="border-b h-16 flex items-center px-4 ">
        <div className="w-full flex items-center">
          <button
            onClick={onClose}
            className={cn(
              "p-2 flex items-center justify-center rounded-full text-muted-foreground",
              "hover:bg-muted/90 transition-colors duration-200",
            )}
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex-1 pl-4">
            <h1 className="text-lg truncate">{displayName}</h1>
          </div>

          <button
            onClick={onEdit}
            className={cn(
              "p-2 flex items-center justify-center rounded-full text-muted-foreground",
              "hover:bg-muted/90 transition-colors duration-200",
            )}
          >
            <Pencil className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden">
        <section className="flex flex-col items-center justify-center gap-4 p-4">
          <UserAvatar size={"xl"} />
          <div className="mt-2 text-center">
            <h1 className="text-xl font-semibold">{displayName}</h1>
            <p className="text-center text-sm text-muted-foreground">
              {statusText}
            </p>
          </div>
        </section>

        <section className="p-2">
          {chat?.type === "direct" ? (
            <InfoAction icon={Phone} label="Phone" value="+1234567889" />
          ) : (
            <InfoAction
              icon={Link}
              label="Link"
              value={chat?.metadata.title || "No link attached"}
            />
          )}
          <InfoAction icon={Bell} label="Notifications" value="Enabled" />
          <InfoAction icon={BlocksIcon} label="Block User" value="Enabled" />
          <InfoAction icon={Trash} label="Delete" value="Enabled" />
        </section>
      </div>

      <section className="flex-1 p-2 overflow-y-auto border-t">
        <h1 className="p-2 text-lg text-center font-semibold">
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

interface InfoActionProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const InfoAction = ({ icon: Icon, label, value }: InfoActionProps) => {
  return (
    <div className="px-4 py-2 rounded-lg group hover:bg-muted/70 transition-colors duration-200 cursor-pointer">
      <div className="flex items-center gap-6">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm">{value}</p>
          <p className="text-muted-foreground text-sm">{label}</p>
        </div>
      </div>
    </div>
  );
};
