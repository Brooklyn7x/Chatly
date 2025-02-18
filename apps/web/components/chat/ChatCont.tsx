import { useChatSocket } from "@/hooks/useChatSocket";
import { useGroupSocket } from "@/hooks/useGroupSocket";
import { socketService } from "@/services/socket/socketService";
import { useChatStore } from "@/store/useChatStore";
import { useEffect } from "react";

export default function ChatContainer() {
  const { chats, activeChatId } = useChatStore();
  const chat = chats.find((chat) => chat?._id === activeChatId);

  if (chat?.type === "direct") {
    
  }

  if (chat?.type === "group") {
    useGroupSocket(activeChatId || "");
  }
  // useEffect(() => {}, []);

  return <div>Chat Auth</div>;
}
