import { useChatStore } from "@/store/useChatStore";
import useUserStore from "@/store/useUserStore";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useDirectModal = (isOpen: boolean, onClose: () => void) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { searchUsers, searchResults, loading } = useUserStore();
  const createChat = useChatStore((state) => state.createChat);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      searchUsers();
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = "unset";
        setSelectedUserId(null);
        setSearchQuery("");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId === selectedUserId ? null : userId);
  };

  const handleCreateDirectChat = useCallback(async () => {
    if (!selectedUserId) return;
    try {
      const selectedUser = searchResults.find(
        (user) => user._id === selectedUserId
      );
      if (!selectedUser) {
        toast.error("Please select user");
        return;
      }
      createChat([selectedUser]);
      onClose();
    } catch (error: any) {
      toast.error("Failed to create chat:", error);
    }
  }, [selectedUserId, searchResults, createChat, onClose]);

  return {
    shouldRender,
    searchQuery,
    setSearchQuery,
    selectedUserId,
    loading,
    searchResults,
    handleUserSelect,
    handleCreateDirectChat,
  };
};
