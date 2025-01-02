import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Camera, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserItem } from "./UserItem";
import useAuth from "@/hooks/useAuth";
import { useChatStore } from "@/store/useChatStore";
import useUserStore from "@/store/useUserStore";
import { User } from "@/types";
import socketService from "@/services/socket";

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GroupFormData {
  name: string;
  image: File | null;
  selectedUserIds: Set<string>;
}

export const GroupModal = ({ isOpen, onClose }: GroupModalProps) => {
  const { searchUsers, searchResults, loading } = useUserStore();
  const { createGroup } = socketService;
  const [shouldRender, setShouldRender] = useState(false);
  const [step, setStep] = useState<"members" | "details">("members");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<GroupFormData>({
    name: "",
    image: null,
    selectedUserIds: new Set(),
  });

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      searchUsers();
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = "unset";
        resetForm();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const resetForm = () => {
    setStep("members");
    setFormData({
      name: "",
      image: null,
      selectedUserIds: new Set(),
    });
    setPreviewImage(null);
    setSearchQuery("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserToggle = (userId: string) => {
    setFormData((prev) => {
      const newSelectedIds = new Set(prev.selectedUserIds);
      if (newSelectedIds.has(userId)) {
        newSelectedIds.delete(userId);
      } else {
        newSelectedIds.add(userId);
      }
      return { ...prev, selectedUserIds: newSelectedIds };
    });
  };

  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      if (formData.selectedUserIds.size === 0) {
        console.error("No users selected");
        return;
      }

      const selectedUserIds = Array.from(formData.selectedUserIds);

      const groupResponse = await socketService.createGroup({
        name: formData.name,
        participantIds: selectedUserIds,
      });

      if (groupResponse.conversationId) {
        const selectedUsers = searchResults.filter((user) =>
          formData.selectedUserIds.has(user._id)
        );
        useChatStore.getState().createChat(selectedUsers, formData.name);
      }
      console.log(groupResponse);

      onClose();
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const unsubscribeGroupCreated = socketService.onGroupCreated((data) => {
        console.log("Group created:", data);
      });

      return () => {
        unsubscribeGroupCreated();
      };
    }
  }, [isOpen]);

  const handleNext = () => {
    if (step === "members" && formData.selectedUserIds.size > 0) {
      setStep("details");
    } else if (step === "details" && formData.name.trim()) {
      handleSubmit();
    }
  };

  const selectedUsers = searchResults.filter((user) =>
    formData.selectedUserIds.has(user._id)
  );

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
        <div className="relative flex flex-col h-full p-4">
          {/* Members Selection Step */}
          <div
            className={cn(
              "absolute inset-0 p-4 transition-all duration-300 ease-in-out",
              step === "members"
                ? "translate-x-0 opacity-100 pointer-events-auto"
                : "-translate-x-full opacity-0 pointer-events-none"
            )}
          >
            <div className="flex flex-col h-full">
              <header className="flex items-center gap-4 mb-4">
                <button
                  onClick={onClose}
                  className="p-2 text-muted-foreground rounded-full 
                    transition-colors hover:bg-muted/70"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-medium">
                  Add Members ({formData.selectedUserIds.size})
                </h1>
              </header>

              <div className="relative w-full mb-4">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-12 pr-4 bg-muted/50 rounded-lg border 
                    text-md outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search people"
                />

                {selectedUsers.length > 0 && (
                  <div className="mt-3 -mb-1">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                      {selectedUsers.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center h-8 w-8 flex-shrink-0 bg-muted/50 rounded-full pr-3"
                        >
                          <img
                            src={user.avatar || "/user.jpeg"}
                            className="h-full w-full object-cover"
                            alt={user.name}
                          />
                          <span className="text-sm ml-2">{user.username}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                  </div>
                ) : (
                  <div className="border-t pt-2">
                    {searchResults
                      .filter((user) => user._id)
                      .map((user) => (
                        <div
                          key={user._id}
                          onClick={() => handleUserToggle(user._id)}
                          className="cursor-pointer"
                        >
                          <UserItem
                            user={user}
                            selected={formData.selectedUserIds.has(user._id)}
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Group Details Step */}
          <div
            className={cn(
              "absolute inset-0 p-4 transition-all duration-300 ease-in-out",
              step === "details"
                ? "translate-x-0 opacity-100 pointer-events-auto"
                : "translate-x-full opacity-0 pointer-events-none"
            )}
          >
            <div className="flex flex-col h-full">
              <header className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setStep("members")}
                  className="p-2 text-muted-foreground rounded-full 
                    transition-colors hover:bg-muted/70"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-medium">New Group</h1>
              </header>

              <div className="flex flex-col items-center gap-8">
                <div className="relative group h-32 w-32">
                  <button
                    className="h-full w-full rounded-full bg-muted/50 
                      flex items-center justify-center transition-all 
                      hover:bg-muted/70 overflow-hidden"
                  >
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Group"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Camera className="h-12 w-12 text-muted-foreground" />
                    )}
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                <div className="w-full px-6">
                  <input
                    value={formData.name}
                    onChange={handleGroupNameChange}
                    className="w-full h-12 px-4 rounded-lg border bg-muted/50 
                      outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Group Name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Next/Submit Button */}
          <div className="absolute right-6 bottom-6">
            <button
              onClick={handleNext}
              disabled={
                (step === "members" && formData.selectedUserIds.size === 0) ||
                (step === "details" && !formData.name.trim())
              }
              className={cn(
                "h-14 w-14 rounded-full flex items-center justify-center",
                "transition-all duration-300 ease-out hover:shadow-lg active:scale-95",
                "disabled:cursor-not-allowed disabled:opacity-50",
                (step === "members" && formData.selectedUserIds.size > 0) ||
                  (step === "details" && formData.name.trim())
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-muted hover:bg-muted/60 text-muted-foreground"
              )}
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
