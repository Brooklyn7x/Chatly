"use client";
import { ArrowLeft, Plus, UserPlus, Search, UserRound } from "lucide-react";
import { NavigationButton } from "../shared/NavigationButton";
import { SearchInput } from "../shared/SearchInput";
import { UserList } from "../user/UserList";
import { toast } from "sonner";
import { useState } from "react";
import { useCreateChat } from "@/hooks/useChats";
import FloatinButton from "../shared/FloatinButton";
import { Loading } from "../ui/loading";
import {
  useAddNewContact,
  useFetchContacts,
  useSearchUser,
} from "@/hooks/useContact";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { User } from "@/types";
import useAuthStore from "@/store/useAuthStore";
import { useSocketStore } from "@/store/useSocketStore";

interface PrivateChatProps {
  onClose: () => void;
}

const PrivateChat = ({ onClose }: PrivateChatProps) => {
  const { user } = useAuthStore();
  const { contacts, isLoading, error } = useFetchContacts();
  const { createChatRoom, isMutating } = useCreateChat();
  const { addNewContact, isLoading: isAdding } = useAddNewContact();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [dialogSearchQuery, setDialogSearchQuery] = useState("");
  const { socket } = useSocketStore();
  const currentUserId = user?.id || user?._id;

  const { users: searchedUsers, isLoading: isSearchLoading } =
    useSearchUser(dialogSearchQuery);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId((prev) => (prev === userId ? null : userId));
  };

  const handleCreateChat = async () => {
    if (!selectedUserId) return;
    try {
      const selectedUser = contacts?.find(
        (user: any) => user.id === selectedUserId
      );
      if (!selectedUser) {
        toast.error("Please select user");
        return;
      }
      const type = "private";
      const participants = [currentUserId, selectedUserId];
      const formattedParticipants = participants.map((userId) => ({
        userId,
      }));

      // await createChatRoom(type, formattedParticipants);
      const data = {
        type,
        participants,
      };
      socket?.emit("conversation:create", data, (error: any, reposone: any) => {
        console.error("Error creating conversation:", error.message);
        console.log(reposone);
        alert(`Error: ${error.message}`);
        return;
      });
      onClose();
    } catch (error: any) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  const handleDialogSearch = (query: string) => {
    setDialogSearchQuery(query);
  };

  const handleDialogClose = () => {
    setIsAddContactDialogOpen(false);
    setDialogSearchQuery("");
  };

  const handleAddFoundContact = async (userId: string) => {
    try {
      const user = searchedUsers.find((user: User) => user.id === userId);
      if (!user) return;
      await addNewContact(user.id);
      toast.success(`Added ${user.username} as a contact`);
      setIsAddContactDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add contact");
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
  };

  if (error) return <p>Error loading contacts</p>;

  return (
    <div className="fixed inset-0 bg-background">
      <div onClick={onClose} />
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
            onClick={() => setIsAddContactDialogOpen(true)}
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
              {isMutating ? <Loading /> : <Plus className="h-5 w-5" />}
            </FloatinButton>
          </div>
        )}

        <Dialog open={isAddContactDialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col rounded-xl">
            <DialogHeader className="p-2">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold">
                  Add New Contact
                </DialogTitle>
              </div>
              <DialogDescription className="sr-only">
                Search for users or add by email address
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 pb-2">
              <div className="relative">
                <div className="absolute left-3 top-3 text-muted-foreground">
                  <Search className="h-5 w-5" />
                </div>
                <Input
                  type="text"
                  placeholder="Search by name or email"
                  className="pl-10 h-12 rounded-lg"
                  value={dialogSearchQuery}
                  onChange={(e) => handleDialogSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 min-h-[200px]">
              {isSearchLoading ? (
                <div className="flex justify-center my-8">
                  <Loading />
                </div>
              ) : searchedUsers.length > 0 ? (
                <div className="space-y-2 mt-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Search Results
                  </p>
                  {searchedUsers.map((user: User) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/60 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <UserRound className="h-5 w-5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.username}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 rounded-full"
                        onClick={() => handleAddFoundContact(user.id)}
                        disabled={isAdding}
                      >
                        {isAdding ? (
                          <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-1" />
                            <span>Add</span>
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-24 text-center mt-4">
                  {dialogSearchQuery.trim() ? (
                    <>
                      <p className="text-sm text-muted-foreground mb-1">
                        No users found with that name
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Send a request directly using their email address
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Type to search for users
                    </p>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PrivateChat;
