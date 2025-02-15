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
import { EditProfileForm } from "../shared/ProfileForm";
import { UserAvatar } from "../user/UserAvatar";
import { motion } from "framer-motion";
import { UserItem } from "../sidebar/UserItem";
import { useChatStore } from "@/store/useChatStore";
import { useChatPanelStore } from "@/store/useChatPanelStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Loading } from "../ui/loading";
import { RemoveMemberDialog } from "../modal/RemoveMemberDailog";
import { AddMemberDailog } from "../modal/AddMemberDailog";
import { EditChatDailog } from "../modal/EditChatDailog";

export function ChatInfo() {
  const [editing, setEditing] = useState(false);
  const [addMemeber, setAddMember] = useState(false);
  const [removingUser, setRemovingUser] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { chats, activeChatId } = useChatStore();
  const { setIsOpen } = useChatPanelStore();

  const chat = chats.find((chat) => chat._id === activeChatId);
  const onEdit = () => {
    setEditing((prev) => !prev);
  };
  const isGroupChat = chat?.type === "group";
  const [data, setData] = useState({
    groupName: "Data",
    groupDescription: "Descropt",
  });

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
    try {
      if (!data.groupName.trim()) {
        toast.error("Please enter group name");
        return;
      }
      setEditing(false);
    } catch (error: any) {
      toast.error("Failed to update group");
    }
  };

  const onAddMember = async () => {
    try {
      if (selectedMember.length < 0) {
        toast.error("Select Member");
        return;
      }
      await new Promise((resolve, reject) => setTimeout(reject, 1000));
    } catch (error) {
      toast.error("Failed to add members! Try again");
    }
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
        <div className="flex items-center justify-between mb-4">
          <h1 className="p-2 text-lg text-center font-semibold">
            {chat?.type === "direct" ? "Members" : "Shared Groups"}
          </h1>

          <Button size="sm" onClick={() => setRemovingUser(true)}>
            Manage Members
          </Button>
        </div>

        <div className="space-y-1">
          {chat?.participants.map((participant) => (
            <UserItem key={participant.userId._id} user={participant.userId} />
          ))}
          {/* <UserItem key={participant._id} user={participant} /> */}
        </div>

        <SharedMedia chatId={chat?._id} />
      </section>

      <button
        onClick={() => setAddMember(true)}
        className="h-12 w-12 flex items-center justify-center bg-green-400 rounded-full absolute bottom-5 right-5 "
      >
        <PlusCircle className="h-6 w-6" />
      </button>

      {/* <Dialog open={editing} onOpenChange={setEditing}>
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
              value={data.groupName}
              onChange={(e) => setData({ ...data, groupName: e.target.value })}
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
            <Button type="submit" onClick={onSubmit} disabled={isLoading}>
              {isLoading ? <Loading /> : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* {editing && (
        <EditProfileForm isOpen={editing} onClose={() => setEditing(false)} />
      )} */}

      <EditChatDailog open={editing} onClose={setEditing} onSubmit={onEdit} />

      <AddMemberDailog
        open={addMemeber}
        onClose={setAddMember}
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

interface SharedMediaProps {
  chatId: string;
}
type tabs = "members" | "media" | "link" | "links";
const SharedMedia = ({ chatId }: SharedMediaProps) => {
  const [activeTab, setActiveTab] = useState<tabs>("members");
  // const {} = useSharedMedia(chatId)

  return (
    <div>
      <div className="flex gap-4 mb-4">
        {["members", "media", "files", "links"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`
              px-4 py-2 rounded-lg text-sm
              ${
                activeTab === tab
                  ? "bg-muted text-green-400"
                  : "text-white hover:bg-muted/60"
              }
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "members" && (
        <div className="space-y-1">
          {/* {Array.from({ length: 10 }).map((participant) => (
            // <UserItem key={participant._id} user={participant} />
            <div className="p-2 border rounded-xl">User1</div>
          ))} */}
          {/* <UserItem key={participant._id} user={participant} /> */}
        </div>
      )}

      <div className="grid grid-cols-3 gap-1">
        {activeTab === "media" &&
          Array.from({ length: 10 }).map((item, index) => (
            <div
              key={index}
              className="aspect-square relative cursor-pointer group"
            >
              <img
                src={"/user.png"}
                alt=""
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-black/50 opacity-0 
            group-hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

// const ChatNotifications = () => {
//   return (
//     <div className="space-y-4">
//       {/* Mute Toggle */}
//       <div className="flex items-center justify-between">
//         <span className="text-white">Notifications</span>
//         <Switch
//           checked={!activeChat.isMuted}
//           onChange={() =>
//             activeChat.isMuted
//               ? actions.unmuteChat(activeChat.id)
//               : actions.muteChat(activeChat.id)
//           }
//         />
//       </div>

//       {/* Show Preview */}
//       <div className="flex items-center justify-between">
//         <span className="text-white">Message Preview</span>
//         <Switch
//           checked={activeChat.showPreview}
//           onChange={() => {
//             /* Implement preview toggle */
//           }}
//         />
//       </div>
//     </div>
//   );
// };
