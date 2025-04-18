import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useChatPanelStore } from "@/store/useChatPanelStore";
import { useChatStore } from "@/store/useChatStore";

import ChatSetting from "./ChatSetting";
import ChatMembers from "./ChatMembers";
import SharedMedia from "./SharedMedia";
import ChatMetadata from "./ChatMetadata";
import EditChatInfo from "../modal/EditChatInfo";

const ChatInfo = () => {
  const [isChatInfoModal, setIsChatInfoModal] = useState(false);
  const { isOpen, setIsOpen } = useChatPanelStore();
  const { chats, activeChatId } = useChatStore();
  const chat = chats.find((chat) => chat._id === activeChatId);
  const isGroup = chat?.type === "group";

  const handleCloseSheet = () => {
    setIsOpen(false);
  };

  if (!chat) return;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} modal>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0">
        <SheetTitle className="sr-only">Chat Info</SheetTitle>
        <div className="h-full w-full text-card-foreground flex flex-col">
          <ChatInfoHeader onClose={handleCloseSheet} />
          <ChatMetadata
            chat={chat}
            isGroup={isGroup}
            onEditChatInfo={() => setIsChatInfoModal(true)}
          />
          <ScrollArea className="flex-1 border-t">
            <ChatSetting chat={chat} isGroup={isGroup} />
            {isGroup && chat?.participants && <ChatMembers chat={chat} />}
            <SharedMedia />
          </ScrollArea>

          {isChatInfoModal && (
            <EditChatInfo
              open={isChatInfoModal}
              onOpenChange={setIsChatInfoModal}
              title={chat?.name || ""}
              descriptions={chat?.descriptions || ""}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatInfo;

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatInfoHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <div className="border-b p-5 flex items-center justify-between">
      <h2 className="text-lg font-semibold">Chat Info</h2>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full h-9 w-9 border"
        onClick={onClose}
      >
        <X className="text-muted-foreground" size={16} />
      </Button>
    </div>
  );
};
