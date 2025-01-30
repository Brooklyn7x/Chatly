import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ActionButton } from "../shared/ActionButton";
import { GroupDetailsForm } from "../form/GroupDetailsForm";
import { StepContainer } from "./StepContainer";
import { UserList } from "../user/UserList";
import { SelectUserList } from "../user/SelectedUserList";
import { SearchInput } from "../shared/SearchInput";
import { NavigationButton } from "../shared/NavigationButton";
import { useGroupModal } from "@/hooks/useGroupModal";

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroupModal = ({ isOpen, onClose }: GroupModalProps) => {
  const {
    formData,
    shouldRender,
    step,
    loading,
    searchQuery,
    previewImage,
    selectedUsers,
    searchResults,
    setStep,
    setSearchQuery,
    handleGroupNameChange,
    handleImageChange,
    handleNext,
    handleUserToggle,
  } = useGroupModal(isOpen, onClose);

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
                <NavigationButton
                  onClick={() => setStep("members")}
                  icon={ArrowLeft}
                />
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
