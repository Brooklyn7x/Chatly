import { socketService } from "@/services/socket/socketService";
import useAuthStore from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { useMessageStore } from "@/store/useMessageStore";
import { useEffect } from "react";

export const useSocket = () => {
  const { user } = useAuthStore();
  const { updateChat } = useChatStore();
  const { addMessage, updateMessage, deleteMessage } = useMessageStore();

  const setupSocketListeners = () => {
    socketService.on("message:new", addMessage);
    socketService.on("message:update", updateMessage);
    socketService.on("message:delete", deleteMessage);
  };

  useEffect(() => {
    if (user) {
      socketService.initialize();
      setupSocketListeners();
    }

    return () => {
      socketService.disconnect();
    };
  }, []);
};
