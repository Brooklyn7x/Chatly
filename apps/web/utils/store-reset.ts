import { useChatStore } from "@/store/useChatStore";
import { useMessageStore } from "@/store/useMessageStore";
import { useUIStore } from "@/store/useUiStore";

export const resetAllStores = () => {
  useChatStore.setState({
    chats: [],
    activeChatId: null,
  });

  useMessageStore.setState({
    messages: {},
  });

  useUIStore.setState({
    isMobile: false,
  });
};
