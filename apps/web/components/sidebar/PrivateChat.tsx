"use client";

import { ArrowLeft, Plus } from "lucide-react";
import { NavigationButton } from "../shared/NavigationButton";
import { SearchInput } from "../shared/SearchInput";
import { UserList } from "../user/UserList";
import { ActionButton } from "../shared/ActionButton";
import { toast } from "sonner";
import { useState } from "react";
import { useSearchUser } from "@/hooks/useSearchUser";
import { useChats } from "@/hooks/useChats";
import FloatinButton from "../shared/FloatinButton";

interface PrivateChatProps {
  onClose: () => void;
}

export const PrivateChat = ({ onClose }: PrivateChatProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { users } = useSearchUser("");
  const { createChat } = useChats();

  const handleUserSelect = (userId: string) => {
    setSelectedUserId((prev) => (prev === userId ? null : userId));
  };

  const handleCreateChat = async () => {
    if (!selectedUserId) return;
    try {
      const selectedUser = users.find((user) => user.id === selectedUserId);
      if (!selectedUser) {
        toast.error("Please select user");
        return;
      }

      await createChat([selectedUserId]);

      onClose();
    } catch (error: any) {
      toast.error("Failed to create chat:", error);
    }
  };

  return (
    <div className="fixed inset-0">
      <div onClick={onClose} />
      <div className="relative h-full w-full flex flex-col">
        <div className="h-16 flex items-center gap-4 p-4 border-b">
          <NavigationButton onClick={onClose} icon={ArrowLeft} />
          <SearchInput
            onChange={setSearchQuery}
            value={searchQuery}
            placeholder="Search User"
          />
        </div>
        <main className="flex-1 overflow-y-auto">
          <UserList
            users={users}
            onUserToggle={handleUserSelect}
            selectedUserIds={
              selectedUserId ? new Set([selectedUserId]) : new Set()
            }
          />
        </main>
        <div className="absolute right-6 bottom-6">
          <FloatinButton onClick={handleCreateChat} disabled={!selectedUserId}>
            <Plus className="h-5 w-5" />
          </FloatinButton>
        </div>
      </div>
    </div>
  );
};
