import { cn } from "@/lib/utils";
import { X, Pencil, Trash, PlusCircle, User2, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useChatStore } from "@/store/useChatStore";
import { useChatPanelStore } from "@/store/useChatPanelStore";
import { RemoveMemberDialog } from "../modal/RemoveMemberDailog";
import { AddMemberDailog } from "../modal/AddMemberDailog";
import { EditChatDailog } from "../modal/EditChatDailog";
import { useChats } from "@/hooks/useChats";
import { SharedMedia } from "./SharedMedia";
import { UserAvatar } from "../shared/UserAvatar";
import { toast } from "sonner";
import { ParticipantRole } from "@/types/chat";
import { DeleteChatDailog } from "../modal/DeleteChatDailog";
import FloatinButton from "../shared/FloatinButton";

export function ChatInfo() {
  const [editing, setEditing] = useState(false);
  const [addMember, setAddMember] = useState(false);
  const [removingUser, setRemovingUser] = useState(false);
  const [deleteChat, setDeleteChat] = useState(false);
  const { chats, activeChatId } = useChatStore();
  const { setIsOpen } = useChatPanelStore();
  const { updateCht, deleteCht } = useChats();

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

  const handleUpdateTitle = async (data: any) => {
    try {
      await updateCht(activeChatId || "", {
        metadata: {
          title: data.groupTitle,
          description: data.groupDescription,
        },
      });
      setEditing(false);
      //update store here
    } catch (error: any) {
      toast.error("Failed to update group data. Try again!");
    }
  };

  const handleAddMember = async (userIds: string[]) => {
    try {
      if (!activeChatId) {
        toast.error("No active chat selected");
        return;
      }

      if (userIds.length === 0) {
        toast.error("Select at least one member to add");
        return;
      }

      await updateCht(activeChatId, {
        participants: userIds.map((userId) => ({
          action: "add",
          userId,
          role: ParticipantRole.MEMBER,
        })),
      });
      //update store after adding user
      setAddMember(false);
      toast.success("Members added successfully");
    } catch (error) {
      toast.error("Failed to add members. Please try again.");
    }
  };

  const handleRemoveMemeber = async (userId: string) => {
    try {
      await updateCht(activeChatId || "", {
        participants: [
          {
            action: "remove",
            userId,
          },
        ],
      });
      setRemovingUser(false);
      //update store after removing user
    } catch (error: any) {
      toast.error("Failed to update group data. Try again!");
    }
  };

  const handleDeleteChat = async () => {
    try {
      if (!activeChatId) return;
      await deleteCht(activeChatId);
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to delete chat");
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
        "fixed inset-y-0 right-0 w-full sm:w-[400px] bg-background/90 backdrop-blur-md  sm:border-l shadow-md",
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
            <h1 className="text-lg font-medium truncate">{displayName}</h1>
          </div>

          {isGroupChat && (
            <button
              onClick={onEdit}
              className={cn(
                "h-10 w-10 p-2 flex items-center justify-center rounded-full text-muted-foreground",
                "hover:bg-muted/90 transition-colors duration-200"
              )}
            >
              <Pencil size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col overflow-hidden">
        <section className="flex flex-col items-center justify-center gap-4 p-4">
          <UserAvatar size="xl" className="ring-2 ring-primary/50" />
          <div className="mt-2 text-center">
            <h1 className="text-xl font-semibold">{displayName}</h1>
            <p className="text-center text-sm text-muted-foreground mt-1">
              {statusText}
            </p>
          </div>
        </section>

        <section className="p-2 space-y-2">
          <div
            onClick={() => setDeleteChat(true)}
            className="p-4 border rounded-lg group hover:bg-muted/70 transition-colors duration-200 cursor-pointer active:scale-[0.98]"
          >
            <div className="flex items-center gap-6">
              <Trash className="h-5 w-5 text-red-500" />
              <div className="flex-1">
                <p className="text-sm">Delete this chat</p>
              </div>
            </div>
          </div>

          {isGroupChat && (
            <div
              onClick={() => setRemovingUser(true)}
              className="p-4 border rounded-lg group hover:bg-muted/70 transition-colors duration-200 cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center gap-6">
                <User2 className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm">Manage Members</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="flex-1 border-t overflow-y-auto">
        <SharedMedia chat={chat} />
      </section>

      {isGroupChat && (
        // <button
        //   onClick={() => setAddMember(true)}
        //   className="h-14 w-14 flex items-center justify-center bg-primary/90 rounded-full absolute bottom-5 right-5 shadow-lg hover:bg-primary transition-all duration-200 active:scale-95 focus:outline-none"
        // >
        //   <UserPlus className="h-5 w-5" />
        // </button>
        <div className="absolute right-5 bottom-5">
          <FloatinButton onClick={() => setAddMember(true)}>
            <UserPlus className="h-5 w-5" />
          </FloatinButton>
        </div>
      )}

      <EditChatDailog
        title={chat?.metadata.title || ""}
        description={chat?.metadata.description || ""}
        open={editing}
        onOpenChange={setEditing}
        onSubmit={handleUpdateTitle}
      />

      <AddMemberDailog
        open={addMember}
        onOpenChange={setAddMember}
        participants={chat?.participants || []}
        onAdd={handleAddMember}
      />

      <RemoveMemberDialog
        open={removingUser}
        onOpenChange={setRemovingUser}
        participants={chat?.participants || []}
        onRemove={handleRemoveMemeber}
      />

      <DeleteChatDailog
        open={deleteChat}
        onOpenChange={setDeleteChat}
        onConfirm={handleDeleteChat}
      />
    </motion.div>
  );
}
