import { useChatStore } from "@/store/useChatStore";
import { useMessageStore } from "@/store/useMessageStore";
import { useUIStore } from "@/store/useUiStore";

export const resetAllStores = () => {
  useChatStore.setState({
    chats: [],
    activeChatId: null,
    isLoading: false,
    error: null,
  });

  useMessageStore.setState({
    messages: {},
    isLoading: false,
    error: null,
  });

  useUIStore.setState({
    isMobile: false,
  });
};
