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
  PlusCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useChatStore } from "@/store/useChatStore";
import { useChatPanelStore } from "@/store/useChatPanelStore";
import { Button } from "../ui/button";
import { RemoveMemberDialog } from "../modal/RemoveMemberDailog";
import { AddMemberDailog } from "../modal/AddMemberDailog";
import { EditChatDailog } from "../modal/EditChatDailog";
import { useChats } from "@/hooks/useChats";
import { SharedMedia } from "./SharedMedia";
import { UserAvatar } from "../shared/Avatar";

export function ChatInfo() {
  const [editing, setEditing] = useState(false);
  const [addMemeber, setAddMember] = useState(false);
  const [removingUser, setRemovingUser] = useState(false);
  const { chats, activeChatId } = useChatStore();
  const { setIsOpen } = useChatPanelStore();
  const {} = useChats();

  const chat = chats.find((chat) => chat._id === activeChatId);
  const onEdit = () => {
    setEditing((prev) => !prev);
  };
  const isGroupChat = chat?.type === "group";

  const displayName = useMemo(() => {
    if (chat?.type === "direct") {
      return chat?.participants[1]?.userId.username || "Direct Message";
    }
    return chat?.metadata?.title || "Group Chat";
  }, [chat]);

  const memberCount = chat?.participants.length || 0;
  const statusText = isGroupChat
    ? `${memberCount} members`
    : "last seen recently";

  const slideAnimation = {
    initial: { translateX: "100%" },
    animate: { translateX: 0 },
    exit: { translateX: "100%" },
    transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
  };

  const onSubmit = async () => {
    // try {
    //   if (!data.groupName.trim()) {
    //     toast.error("Please enter group name");
    //     return;
    //   }
    //   setEditing(false);
    // } catch (error: any) {
    //   toast.error("Failed to update group");
    // }
  };

  const onAddMember = async () => {
    // try {
    //   if (selectedMember.length < 0) {
    //     toast.error("Select Member");
    //     return;
    //   }
    //   await new Promise((resolve, reject) => setTimeout(reject, 1000));
    // } catch (error) {
    //   toast.error("Failed to add members! Try again");
    // }
  };

  return (
    <motion.div
      initial={{
        translateX: "100%",
      }}
      animate={{
        translateX: 0,
      }}
      exit={{
        translateX: "100%",
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      className={cn(
        "fixed inset-y-0 right-0 w-full sm:w-[400px] bg-background/70 backdrop-blur-md  sm:border-l shadow-md",
        "flex flex-col"
      )}
    >
      <div className="border-b h-16 flex items-center px-4">
        <div className="w-full flex items-center">
          <button
            onClick={() => setIsOpen(false)}
            className={cn(
              "p-2 flex items-center justify-center rounded-full text-muted-foreground",
              "hover:bg-muted/90 transition-colors duration-200"
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
              "hover:bg-muted/90 transition-colors duration-200"
            )}
          >
            <Pencil className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden">
        <section className="flex flex-col items-center justify-center gap-4 p-4">
          <UserAvatar size="xl" />
          <div className="mt-2 text-center">
            <h1 className="text-xl font-semibold">{displayName}</h1>
            <p className="text-center text-sm text-muted-foreground">
              {statusText}
            </p>
          </div>
        </section>

        <section className="p-2">
          {/* <InfoAction icon={Bell} label="Notifications" value="Enabled" />
          <InfoAction icon={BlocksIcon} label="Block User" value="Enabled" /> */}
          <InfoAction icon={Trash} label="Delete" value="Enabled" />
        </section>
      </div>

      <section className="flex-1 p-2 overflow-y-auto border-t">
        <div className="flex items-center justify-between mb-4">
          {chat?.type === "group" && (
            <Button size="sm" onClick={() => setRemovingUser(true)}>
              Manage Members
            </Button>
          )}
        </div>

        <SharedMedia chat={chat} />
      </section>

      <button
        onClick={() => setAddMember(true)}
        className="h-12 w-12 flex items-center justify-center bg-green-400 rounded-full absolute bottom-5 right-5 "
      >
        <PlusCircle className="h-6 w-6" />
      </button>

      <EditChatDailog
        open={editing}
        onOpenChange={setEditing}
        onSubmit={onEdit}
      />

      <AddMemberDailog
        open={addMemeber}
        onOpenChange={setAddMember}
        onAdd={onAddMember}
      />

      <RemoveMemberDialog
        open={removingUser}
        onOpenChange={setRemovingUser}
        participants={chat?.participants || []}
        onRemove={async (userId) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      />
    </motion.div>
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
