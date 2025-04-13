"use client";
import { ArrowLeft, Plus, UserPlus } from "lucide-react";
import { NavigationButton } from "../shared/NavigationButton";
import { SearchInput } from "../shared/SearchInput";
import { UserList } from "../user/UserList";
import { toast } from "sonner";
import { useState } from "react";
import FloatinButton from "../shared/FloatinButton";
import { Loading } from "../ui/loading";
import { useFetchContacts } from "@/hooks/user/useContact";
import { Button } from "../ui/button";
import { useSocketStore } from "@/store/useSocketStore";
import AddNewContact from "./AddNewContact";
import { useAuth } from "@/hooks/auth/useAuth";

interface PrivateChatProps {
  onClose: () => void;
}

const CreatePrivateChat = ({ onClose }: PrivateChatProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [addContact, setAddContact] = useState(false);
  const { user } = useAuth();
  const { contacts, isLoading, error } = useFetchContacts();
  const { socket } = useSocketStore();
  const currentUserId = user?.id || user?._id;

  const handleUserSelect = (userId: string) => {
    setSelectedUserId((prev) => (prev === userId ? null : userId));
  };

  const handleCreateChat = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user to start a chat.");
      return;
    }

    try {
      const selectedUser = contacts?.find(
        (user: any) => user.id === selectedUserId
      );
      if (!selectedUser) {
        toast.error("Selected user not found.");
        return;
      }

      const type = "private";
      const participants = [currentUserId, selectedUserId];
      const formattedParticipants = participants.map((userId) => ({
        userId,
      }));

      const data = {
        type,
        participants: formattedParticipants,
      };

      socket?.emit("conversation:create", data, (err: any) => {
        if (err) {
          toast.error(err.error || "Failed to create chat.");
          return;
        }
        toast.success("Chat created successfully!");
        onClose();
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error creating chat.");
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
  };

  if (error) {
    toast.error("Failed to load contacts.");
  }

  return (
    <div className="absolute inset-0 bg-card">
      <div className="relative h-full w-full flex flex-col">
        <div className="h-16 flex items-center gap-4 p-4 border-b bg-card/50 backdrop-blur-sm">
          <NavigationButton onClick={onClose} icon={ArrowLeft} />
          <div className="flex-1 mx-2">
            <SearchInput
              onChange={handleSearch}
              value={searchQuery}
              placeholder="Search Contacts"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
            title="Add New Contact"
            onClick={() => setAddContact(true)}
          >
            <UserPlus className="h-5 w-5" />
          </Button>
        </div>

        <main className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex justify-center my-8">
              <Loading />
            </div>
          ) : contacts?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <UserPlus className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
              <h3 className="text-xl font-semibold mb-2">No contacts yet</h3>
              <p className="text-muted-foreground mb-6 max-w-xs">
                Add your first contact using the + button above
              </p>
            </div>
          ) : (
            <UserList
              users={contacts}
              onUserToggle={handleUserSelect}
              selectedUserIds={
                selectedUserId ? new Set([selectedUserId]) : new Set()
              }
            />
          )}
        </main>

        {selectedUserId && (
          <div className="absolute right-6 bottom-6">
            <FloatinButton
              onClick={handleCreateChat}
              disabled={!selectedUserId}
              className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all"
            >
              <Plus className="h-5 w-5" />
            </FloatinButton>
          </div>
        )}

        <AddNewContact
          open={addContact}
          onOpenChange={() => setAddContact(false)}
        />
      </div>
    </div>
  );
};

export default CreatePrivateChat;
