import { cn } from "@/lib/utils";
import { ArrowLeft, Plus } from "lucide-react";
import { NavigationButton } from "../shared/NavigationButton";
import { SearchInput } from "../shared/SearchInput";
import { UserList } from "../user/UserList";
import { ActionButton } from "../shared/ActionButton";
import { useDirectModal } from "@/hooks/useDirectModal";

interface DirectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DirectModal = ({ isOpen, onClose }: DirectModalProps) => {
  const {
    searchQuery,
    searchResults,
    shouldRender,
    selectedUserId,
    loading,
    handleCreateDirectChat,
    handleUserSelect,
    setSearchQuery,
  } = useDirectModal(isOpen, onClose);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={cn(
          "fixed inset-0 bg-background",
          "transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed inset-y-0 right-0",
          "w-full sm:w-[420px] bg-background",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="relative h-full w-full flex flex-col">
          <header className="h-16 flex items-center gap-4 p-4 border-b">
            <NavigationButton onClick={onClose} icon={ArrowLeft} />
            <SearchInput
              onChange={setSearchQuery}
              value={searchQuery}
              placeholder="Search User"
            />
          </header>
          <main className="flex-1 overflow-y-auto">
            <UserList
              loading={loading}
              users={searchResults}
              onUserToggle={handleUserSelect}
              selectedUserIds={
                selectedUserId ? new Set([selectedUserId]) : new Set()
              }
            />
          </main>
          <div className="absolute right-6 bottom-6">
            <ActionButton
              onClick={handleCreateDirectChat}
              disabled={!selectedUserId}
              icon={Plus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
