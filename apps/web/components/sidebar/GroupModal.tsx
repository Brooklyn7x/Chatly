import { useState, useEffect } from "react";
import useUserStore from "@/store/useUserStore";
import socketService from "@/services/socket";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { ActionButton } from "../shared/ActionButton";
import { GroupDetailsForm } from "../form/GroupDetailsForm";
import { StepContainer } from "../modal/StepContainer";
import { UserList } from "../user/UserList";
import { SelectUserList } from "../user/SelectedUserList";
import { SearchInput } from "../shared/SearchInput";
import NavigationButton from "../shared/NavgationButton";

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
          "absolute inset-0 bg-background transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "h-full w-full sm:w-[420px] bg-background",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="relative h-full w-full flex flex-col p-4">
          <StepContainer isActive={step === "members"} step={step}>
            <div className="flex flex-col h-full">
              <header className="flex items-center gap-4 mb-4">
                <NavigationButton onClick={onClose} icon={ArrowLeft} />
                <h1 className="text-lg font-medium">
                  Add Members ({formData.selectedUserIds.size})
                </h1>
              </header>

              <div className="mb-4">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search Users"
                />

                <SelectUserList users={selectedUsers} />
              </div>

              <UserList
                users={searchResults}
                selectedUserIds={formData.selectedUserIds}
                onUserToggle={handleUserToggle}
                loading={loading}
              />
            </div>
          </StepContainer>

          <StepContainer isActive={step === "details"} step={step}>
            <div className="flex flex-col h-full">
              <header className="flex items-center gap-4 mb-8">
                <NavigationButton onClick={() => setStep('members')} icon={ArrowLeft} />
              </header>

              <GroupDetailsForm
                name={name}
                onNameChange={handleGroupNameChange}
                previewImage={previewImage}
                onImageChange={handleImageChange}
              />
            </div>
          </StepContainer>
        </div>


        
        <div className="absolute right-6 bottom-6">
          <ActionButton
            onClick={handleNext}
            disabled={
              (step === "members" && formData.selectedUserIds.size === 0) ||
              (step === "details" && !formData.name.trim())
            }
            icon={ArrowRight}
          />
        </div>
      </div>
    </div>
  );
};
