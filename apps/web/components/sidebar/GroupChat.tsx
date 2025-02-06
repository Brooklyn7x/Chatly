"use client";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ActionButton } from "../shared/ActionButton";
import { GroupDetailsForm } from "../form/GroupDetailsForm";
import { StepContainer } from "../modal/StepContainer";
import { UserList } from "../user/UserList";
import { SelectUserList } from "../user/SelectedUserList";
import { SearchInput } from "../shared/SearchInput";
import { NavigationButton } from "../shared/NavigationButton";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import { toast } from "sonner";
import { socketService } from "@/services/socket/socketService";

interface GroupChatProps {
  onClose: () => void;
}

export const GroupChat = ({ onClose }: GroupChatProps) => {
  // const {
  //   formData,
  //   shouldRender,
  //   step,
  //   searchQuery,
  //   previewImage,
  //   selectedUsers,
  //   users,
  //   setStep,
  //   setSearchQuery,
  //   handleGroupNameChange,
  //   handleImageChange,
  //   handleNext,
  //   handleUserToggle,
  // } = useGroupChat(isOpen, onClose);

  const [step, setStep] = useState<"members" | "details">("members");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<GroupFormData>({
    name: "",
    image: null,
    selectedUserIds: new Set(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { users } = useSearch("");

  const selectedUsers = useMemo(
    () => users.filter((user) => formData.selectedUserIds.has(user._id)),
    [users, formData.selectedUserIds]
  );

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

  const handleUserToggle = useCallback((userId: string) => {
    setFormData((prev) => {
      const newSelectedIds = new Set(prev.selectedUserIds);
      if (newSelectedIds.has(userId)) {
        newSelectedIds.delete(userId);
      } else {
        newSelectedIds.add(userId);
      }
      return { ...prev, selectedUserIds: newSelectedIds };
    });
  }, []);

  const handleNext = useCallback(() => {
    if (step === "members" && formData.selectedUserIds.size > 0) {
      setStep("details");
    } else if (step === "details" && formData.name.trim()) {
      handleSubmit();
    }
  }, [step, formData.selectedUserIds.size, error]);

  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (formData.selectedUserIds.size === 0) {
        toast.error("Please select at least one user");
        return;
      }

      if (!formData.name.trim()) {
        toast.error("Please enter a group name");
        return;
      }

      const selectedUserIds = Array.from(formData.selectedUserIds);

      // const selectedUsers = users.filter((user) =>
      //   formData.selectedUserIds.has(user._id)
      // );

      const groupResponse = await socketService.createGroup({
        name: formData.name.trim(),
        participantIds: selectedUserIds,
      });

      console.log(selectedUsers, formData, "formdata");
      // useChatStore.getState().createChat(selectedUsers, formData.name);

      // resetForm();
      // onClose();
    } catch (error) {
      toast.error("Failed to create group");
      console.error("Failed to create group:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 ">
      <div onClick={onClose} />
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
              users={users}
              selectedUserIds={formData.selectedUserIds}
              onUserToggle={handleUserToggle}
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
              name={formData.name}
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
  );
};
