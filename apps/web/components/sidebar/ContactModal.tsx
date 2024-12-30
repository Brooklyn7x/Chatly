import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Plus, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserItem } from "./UserItem";
import { useChatStore } from "@/store/useChatStore";
import useUserStore from "@/store/useUserStore";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { searchUsers, searchResults, error, loading } = useUserStore();
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

  const handleCreatePrivateChat = async () => {
    if (selectedUserId) {
      const selectedUser = searchResults.find((user) => user._id === selectedUserId);
      if (selectedUser) {
        await createChat([selectedUser]);
        onClose();
      }
    }
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={cn(
          "fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed inset-y-0 right-0 w-full sm:w-[420px] bg-background",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="relative flex flex-col h-full">
          <div className="h-16 flex items-center gap-4 py-2 px-4 border-b">
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground rounded-full 
                transition-colors hover:bg-muted/70"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-12 pr-4 bg-muted/50 rounded-lg border 
                  text-md outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search contacts"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {searchQuery
                  ? "No users found"
                  : "Start typing to search users"}
              </div>
            ) : (
              searchResults.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserSelect(user._id)}
                  className={cn(
                    "cursor-pointer transition-colors duration-200",
                    user._id === selectedUserId && "bg-muted/50"
                  )}
                >
                  <UserItem user={user} />
                </div>
              ))
            )}
          </div>

          <div className="absolute right-6 bottom-6">
            <button
              onClick={handleCreatePrivateChat}
              disabled={!selectedUserId}
              className={cn(
                "h-14 w-14 rounded-full flex items-center justify-center",
                "transition-all duration-300 ease-out hover:shadow-lg active:scale-95",
                selectedUserId
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-muted hover:bg-muted/60 text-muted-foreground",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
