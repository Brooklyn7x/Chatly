import { Suspense, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { X, Pencil, Trash, User2, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { UserAvatar } from "../shared/UserAvatar";
import FloatinButton from "../shared/FloatinButton";
import { useChats } from "@/hooks/useChats";
import { useChatStore } from "@/store/useChatStore";
import { useChatPanelStore } from "@/store/useChatPanelStore";
import { ParticipantRole } from "@/types/chat";
import dynamic from "next/dynamic";

const SharedMedia = dynamic(() => import("./SharedMedia"));
const RemoveMemberDialog = dynamic(() => import("../modal/RemoveMemberDailog"));
const EditChatDailog = dynamic(() => import("../modal/EditChatDailog"));
const DeleteChatDailog = dynamic(() => import("../modal/DeleteChatDailog"));
const AddMemberDailog = dynamic(() => import("../modal/AddMemberDailog"));

function ChatInfo() {
  const [editing, setEditing] = useState(false);
  const [addMember, setAddMember] = useState(false);
  const [removingUser, setRemovingUser] = useState(false);
  const [deleteChat, setDeleteChat] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const { chats, activeChatId } = useChatStore();
  const { setIsOpen } = useChatPanelStore();
  const { updateChatInfo, deleteCht } = useChats();

  const chat = chats.find((chat) => chat._id === activeChatId);
  const handleOpenEdit = () => {
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

  const handleUpdateTitle = async (data: any) => {
    setIsUpdating(true);
    try {
      await updateChatInfo(activeChatId || "", {
        metadata: {
          title: data.groupTitle,
          description: data.groupDescription,
        },
      });
      setEditing(false);
      toast.success("Chat updated successfully");
    } catch (error: any) {
      toast.error("Failed to update group data. Try again!");
    } finally {
      setIsUpdating(false);
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
      await updateChatInfo(activeChatId, {
        participants: userIds.map((userId) => ({
          action: "add",
          userId,
          role: ParticipantRole.MEMBER,
        })),
      });
      toast.success("Members added");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add members. Please try again.");
    }
  };

  const handleRemoveMemeber = async (userId: string) => {
    try {
      setRemovingUserId(userId);
      await updateChatInfo(activeChatId || "", {
        participants: [
          {
            action: "remove",
            userId,
          },
        ],
      });

      toast.success("Member removed successfully");
    } catch (error: any) {
      toast.error("Failed to remove member. Try again!");
    } finally {
      setRemovingUserId(null);
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
      <ChatHeader
        displayName={displayName}
        onEdit={handleOpenEdit}
        isGroupChat={isGroupChat}
        onClose={() => setIsOpen(false)}
      />

      <div className="flex flex-col overflow-hidden">
        <ChatProfileSection displayName={displayName} statusText={statusText} />

        <ChatActions
          isGroupChat={isGroupChat}
          onDeleteChat={() => setDeleteChat(true)}
          onManageMembers={() => setRemovingUser(true)}
        />
      </div>

      <section className="flex-1 border-t overflow-y-auto">
        <SharedMedia chat={chat} />
      </section>

      {isGroupChat && (
        <div className="absolute right-5 bottom-5">
          <FloatinButton onClick={() => setAddMember(true)}>
            <UserPlus className="h-5 w-5" />
          </FloatinButton>
        </div>
      )}

      <Suspense fallback={null}>
        <EditChatDailog
          title={chat?.metadata.title || ""}
          description={chat?.metadata.description || ""}
          open={editing}
          onOpenChange={setEditing}
          onSubmit={handleUpdateTitle}
          isLoading={isUpdating}
        />
      </Suspense>

      <Suspense fallback={null}>
        <AddMemberDailog
          open={addMember}
          onOpenChange={setAddMember}
          participants={chat?.participants || []}
          onAdd={handleAddMember}
          isAdding={isAddingMembers}
        />
      </Suspense>

      <Suspense fallback={null}>
        <RemoveMemberDialog
          open={removingUser}
          onOpenChange={setRemovingUser}
          participants={chat?.participants || []}
          onRemove={handleRemoveMemeber}
          removingUserId={removingUserId}
        />
      </Suspense>

      <Suspense fallback={null}>
        <DeleteChatDailog
          open={deleteChat}
          onOpenChange={setDeleteChat}
          onConfirm={handleDeleteChat}
        />
      </Suspense>
    </motion.div>
  );
}

interface CustomButtomProps {
  onClick: () => void;
  icon: React.ReactNode;
}

const CustomButton = ({ icon, onClick }: CustomButtomProps) => {
  return (
    <Button onClick={onClick} variant={"ghost"} size={"icon"}>
      {icon}
    </Button>
  );
};

interface ChatHeaderProps {
  displayName: string;
  isGroupChat: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export function ChatHeader({
  displayName,
  isGroupChat,
  onClose,
  onEdit,
}: ChatHeaderProps) {
  return (
    <div className="border-b h-16 flex items-center px-4">
      <div className="w-full flex items-center">
        <CustomButton onClick={onClose} icon={<X className="h-6 w-6" />} />
        <div className="flex-1 pl-4">
          <h1 className="text-lg font-medium truncate">{displayName}</h1>
        </div>
        {isGroupChat && (
          <CustomButton onClick={onEdit} icon={<Pencil size={18} />} />
        )}
      </div>
    </div>
  );
}

interface ChatProfileSectionProps {
  displayName: string;
  statusText: string;
}

export function ChatProfileSection({
  displayName,
  statusText,
}: ChatProfileSectionProps) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 p-4">
      <UserAvatar size="xl" className="ring-2 ring-primary/50" />
      <div className="mt-2 text-center">
        <h1 className="text-xl font-semibold">{displayName}</h1>
        <p className="text-center text-sm text-muted-foreground mt-1">
          {statusText}
        </p>
      </div>
    </section>
  );
}

interface ChatActionsProps {
  isGroupChat: boolean;
  onDeleteChat: () => void;
  onManageMembers: () => void;
}

export function ChatActions({
  isGroupChat,
  onDeleteChat,
  onManageMembers,
}: ChatActionsProps) {
  return (
    <section className="p-2 space-y-2">
      <ActionButton
        icon={<Trash className="h-5 w-5 text-red-500" />}
        label="Delete this chat"
        onClick={onDeleteChat}
      />
      {isGroupChat && (
        <ActionButton
          icon={<User2 className="h-5 w-5 text-primary" />}
          label="Manage Members"
          onClick={onManageMembers}
        />
      )}
    </section>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={onClick}
      onKeyPress={(e) => e.key === "Enter" && onClick()}
      className="p-4 border rounded-lg group hover:bg-muted/70 transition-colors duration-200 cursor-pointer active:scale-[0.98]"
    >
      <div className="flex items-center gap-6">
        {icon}
        <div className="flex-1">
          <p className="text-sm">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default ChatInfo;
