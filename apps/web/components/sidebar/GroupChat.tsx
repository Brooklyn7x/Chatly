"use client";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { GroupDetailsForm } from "../form/GroupDetailsForm";
import { StepContainer } from "../modal/StepContainer";
import { UserList } from "../user/UserList";
import { SelectUserList } from "../user/SelectedUserList";
import { SearchInput } from "../shared/SearchInput";
import { NavigationButton } from "../shared/NavigationButton";
import FloatinButton from "../shared/FloatinButton";
import { Loading } from "../ui/loading";
import { useSearchUsers } from "@/hooks/useSearchUser";
import { useChats } from "@/hooks/useChats";
import { useGroupChatForm } from "@/hooks/useGroupChat";

interface GroupChatProps {
  onClose: () => void;
}

interface User {
  _id: string;
}

const GroupChat = ({ onClose }: GroupChatProps) => {
  const [step, setStep] = useState<"members" | "details">("members");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    formData,
    resetForm,
    handleNameChange,
    handleImageChange,
    handleUserToggle,
  } = useGroupChatForm();

  const { users, isLoading } = useSearchUsers(searchQuery);
  const { createChat } = useChats();

  const selectedUsers = useMemo<User[]>(
    () => users.filter((user: any) => formData.selectedUserIds.has(user._id)),
    [users, formData.selectedUserIds]
  );

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      validateForm();
      await createChat(
        Array.from(formData.selectedUserIds),
        formData.name.trim()
      );
      toast.success("Group created successfully");
      resetForm();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create group");
    } finally {
      setIsSubmitting(false);
    }
  }, [createChat, formData, isSubmitting, onClose, resetForm]);

  const validateForm = () => {
    if (formData.selectedUserIds.size === 0) {
      throw new Error("Please select at least one user");
    }
    if (!formData.name.trim()) {
      throw new Error("Please enter a group name");
    }
  };

  const handleNext = useCallback(() => {
    if (step === "members") {
      if (formData.selectedUserIds.size > 0) {
        setStep("details");
      } else {
        toast.error("Please select at least one user");
      }
    } else if (step === "details") {
      handleSubmit();
    }
  }, [step, formData, handleSubmit]);

  return (
    <div className="fixed inset-0">
      <div onClick={onClose} className="absolute inset-0 bg-black opacity-30" />

      <div className="relative h-full w-full flex flex-col p-4 ">
        <StepContainer isActive={step === "members"} step={step}>
          <MembersStep
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedUsers={selectedUsers}
            users={users}
            isLoading={isLoading}
            handleUserToggle={handleUserToggle}
            onClose={onClose}
          />
        </StepContainer>

        <StepContainer isActive={step === "details"} step={step}>
          <DetailsStep
            formData={formData}
            handleNameChange={handleNameChange}
            handleImageChange={handleImageChange}
            previewImage={previewImage}
            setStep={setStep}
          />
        </StepContainer>
      </div>

      <div className="absolute right-6 bottom-6">
        <FloatinButton
          onClick={handleNext}
          disabled={
            (step === "members" && formData.selectedUserIds.size === 0) ||
            (step === "details" && !formData.name.trim()) ||
            isSubmitting
          }
        >
          <ArrowRight className="h-5 w-5" />
        </FloatinButton>
      </div>
    </div>
  );
};

interface MembersStepProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedUsers: User[];
  users: User[];
  isLoading: boolean;
  handleUserToggle: (userId: string) => void;
  onClose: () => void;
}

const MembersStep = ({
  searchQuery,
  setSearchQuery,
  selectedUsers,
  users,
  isLoading,
  handleUserToggle,
  onClose,
}: MembersStepProps) => (
  <div className="flex flex-col h-full">
    <header className="flex items-center gap-4 mb-8">
      <NavigationButton onClick={onClose} icon={X} />
      <h2 className="text-2xl font-semibold">
        Add Members ({selectedUsers.length})
      </h2>
    </header>

    <div className="mb-4">
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search Users"
      />
      <SelectUserList users={selectedUsers} />
    </div>
    {isLoading ? (
      <div className="my-4">
        <Loading />
      </div>
    ) : (
      <UserList
        users={users}
        selectedUserIds={new Set(selectedUsers.map((user) => user._id))}
        onUserToggle={handleUserToggle}
      />
    )}
  </div>
);

interface DetailsStepProps {
  formData: {
    name: string;
    selectedUserIds: Set<string>;
  };
  handleNameChange: (name: string) => void;
  handleImageChange: (image: File | null) => void;
  previewImage: string | null;
  setStep: (step: "members" | "details") => void;
}

const DetailsStep = ({
  formData,
  handleNameChange,
  handleImageChange,
  previewImage,
  setStep,
}: DetailsStepProps) => (
  <div className="flex flex-col h-full">
    <header className="flex items-center gap-4 mb-8">
      <NavigationButton onClick={() => setStep("members")} icon={ArrowLeft} />
    </header>
    <GroupDetailsForm
      name={formData.name || ""}
      onNameChange={handleNameChange}
      previewImage={previewImage || undefined}
      onImageChange={handleImageChange}
    />
  </div>
);

export default GroupChat;
