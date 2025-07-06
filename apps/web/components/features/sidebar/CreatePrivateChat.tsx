"use client";
import { useState, useCallback } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";
import { UserList } from "@/components/features/modals/UserList";
import { toast } from "sonner";
import { useFetchContacts, useSearchUser } from "@/hooks/user/useContact";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { SearchInput } from "@/components/features/modals/SearchInput";
import FloatinButton from "@/components/features/modals/FloatingButton";
import AddNewContact from "./AddNewContact";
import useChat from "@/hooks/useChat";

interface CreatePrivateChatProps {
  onClose: () => void;
}

const CreatePrivateChat = ({ onClose }: CreatePrivateChatProps) => {
  const [addContact, setAddContact] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);

  const { user } = useAppStore();
  const { users } = useSearchUser(searchQuery);
  const { contacts, isLoading } = useFetchContacts();
  const { createChat } = useChat();

  const usersData = [...contacts, ...users];

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleCreateChat = useCallback(async () => {
    if (!selectedUserId) {
      toast.error("Please select a user to chat with");
      return;
    }

    setIsCreating(true);
    try {
      const currentUserId = user?.id || user?._id;

      if (selectedUserId === currentUserId) {
        toast.error("You cannot create a chat with yourself");
        return;
      }

      const participants = [
        { userId: currentUserId },
        { userId: selectedUserId },
      ];

      const chatData = {
        type: "private",
        participants,
        name: `${user?.username} - ${selectedUserId}`,
        description: "Private conversation",
      };

      await createChat(chatData as any);
      toast.success("Private chat created successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to create private chat");
    } finally {
      setIsCreating(false);
    }
  }, [selectedUserId, user, createChat, onClose]);

  const resetForm = () => {
    setSelectedUserId("");
    setSearchQuery("");
  };

  return (
    <div className="absolute inset-0">
      <div onClick={onClose} className="absolute inset-0 bg-card" />
      <div className="relative h-full w-full flex flex-col p-4 rounded-lg">
        <header className="flex items-center justify-between gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full p-2 hover:bg-primary/10 hover:text-primary transition-colors"
            title="Close"
            onClick={() => {
              onClose();
              resetForm();
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <h2 className="text-2xl font-semibold">New Private Chat</h2>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full p-2 hover:bg-primary/10 hover:text-primary transition-colors"
            title="Add New Contact"
            onClick={() => setAddContact(true)}
          >
            <UserPlus className="h-5 w-5" />
          </Button>
        </header>

        <div className="mb-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search Users"
          />
        </div>

        <div className="flex-1 overflow-y-auto mb-4">
          <UserList
            users={usersData}
            selectedUserIds={new Set(selectedUserId ? [selectedUserId] : [])}
            onUserToggle={handleUserSelect}
            loading={isLoading}
            singleSelect={true}
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleCreateChat}
            disabled={!selectedUserId || isCreating}
            className="flex items-center gap-2"
          >
            {isCreating ? "Creating..." : "Create Chat"}
          </Button>
        </div>

        <FloatinButton
          isVisible={addContact}
          onClick={() => setAddContact(false)}
        >
          <AddNewContact
            open={addContact}
            onClose={() => setAddContact(false)}
          />
        </FloatinButton>
      </div>
    </div>
  );
};

export default CreatePrivateChat;
