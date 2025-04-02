import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import { X, Trash, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { UserAvatar } from "../shared/UserAvatar";
import { useChatStore } from "@/store/useChatStore";
import { useChatPanelStore } from "@/store/useChatPanelStore";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Chat } from "@/types";
import { formatName } from "@/lib/utils";
import AddMemberDailog from "../modal/AddMemberDailog";

const SharedMedia = dynamic(() => import("./SharedMedia"));
const RemoveMemberDialog = dynamic(() => import("../modal/RemoveMemberDailog"));
const EditChatDailog = dynamic(() => import("../modal/EditChatInfo"));
const DeleteChatDailog = dynamic(() => import("../modal/DeleteChatDailog"));

function ChatInfo() {
  const [removingUser, setRemovingUser] = useState(false);
  const [deleteChat, setDeleteChat] = useState(false);
  const { chats, activeChatId } = useChatStore();
  const { setIsOpen } = useChatPanelStore();
  const chat = chats.find((chat) => chat._id === activeChatId);
  const isGroupChat = chat?.type === "group";
  const displayName = formatName(chat!);

  const memberCount = chat?.participants.length || 0;
  const statusText = isGroupChat
    ? `${memberCount} members`
    : "last seen recently";

  return (
    <Sheet open={true} onOpenChange={() => setIsOpen(false)}>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0" hideClose>
        <SheetTitle className="sr-only">Chat info</SheetTitle>
        <ChatHeader
          displayName={displayName || "Chat"}
          chat={chat!}
          isGroup={isGroupChat}
          onClose={() => setIsOpen(false)}
        />

        <div className="flex flex-col overflow-hidden h-full">
          <ChatProfileSection
            descriptions={chat?.descriptions || ""}
            displayName={displayName || "Chat"}
            statusText={statusText}
          />

          <ChatActions
            isGroupChat={isGroupChat}
            onDeleteChat={() => setDeleteChat(true)}
            onManageMembers={() => setRemovingUser(true)}
          />

          <section className="flex-1 border-t overflow-y-auto">
            <SharedMedia chat={chat} />
          </section>
        </div>

        {isGroupChat && (
          <div className="absolute right-5 bottom-5">
            <AddMemberDailog
              chatId={chat._id}
              participants={chat.participants as any}
            />
          </div>
        )}

        <Suspense fallback={null}>
          <RemoveMemberDialog
            open={removingUser}
            onOpenChange={() => setRemovingUser(false)}
            participants={chat?.participants || []}
          />
        </Suspense>

        <Suspense fallback={null}>
          <DeleteChatDailog
            chatId={activeChatId || ""}
            open={deleteChat}
            onOpenChange={setDeleteChat}
          />
        </Suspense>
      </SheetContent>
    </Sheet>
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
  chat: Chat;
  displayName: string;
  isGroup: boolean;
  onClose: () => void;
}

export function ChatHeader({
  chat,
  displayName,
  isGroup,
  onClose,
}: ChatHeaderProps) {
  return (
    <div className="border-b h-16 flex items-center px-4">
      <div className="w-full flex items-center">
        <CustomButton onClick={onClose} icon={<X className="h-6 w-6" />} />
        <div className="flex-1 pl-4">
          <h1 className="text-lg font-medium truncate">{displayName}</h1>
        </div>

        {isGroup && (
          <EditChatDailog
            title={chat?.name || ""}
            descriptions={chat?.descriptions || ""}
          />
        )}
      </div>
    </div>
  );
}

interface ChatProfileSectionProps {
  displayName: string;
  statusText: string;
  descriptions: string;
}

export function ChatProfileSection({
  displayName,
  statusText,
  descriptions,
}: ChatProfileSectionProps) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 p-4">
      <UserAvatar size="xl" />
      <div className="mt-2 text-center">
        <h1 className="text-xl font-semibold">{displayName}</h1>
        <p>{descriptions}</p>
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
