"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, UserPlus } from "lucide-react";

import { useFetchContacts, useSearchUser } from "@/hooks/user/useContact";
import { User } from "@/types";
import { useSocket } from "@/providers/SocketProvider";
import { Button } from "../../ui/button";

import FloatinButton from "@/components/features/modals/FloatingButton";
import { SearchInput } from "@/components/features/modals/SearchInput";
import { NavigationButton } from "@/components/features/modals/NavigationButton";
import AddNewContact from "./AddNewContact";
import { UserList } from "@/components/features/modals/UserList";
import { SelectUserList } from "@/components/features/modals/SelectedUserList";
import { useAppStore } from "@/store/useAppStore";
import { StepContainer } from "../modals/StepContainer";
import { GroupDetailsForm } from "../modals/GroupDetailsForm";
import useChat from "@/hooks/useChat";

interface CreateGroupChatProps {
  onClose: () => void;
}

const CreateGroupChat = ({ onClose }: CreateGroupChatProps) => {
  const [step, setStep] = useState<"members" | "details">("members");
  const [addContact, setAddContact] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [name, setName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set()
  );
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { user } = useAppStore();
  const { users } = useSearchUser(searchQuery);
  const { contacts, isLoading } = useFetchContacts();

  const { createChat } = useChat();

  const usersData = [...contacts, ...users];

  const selectedUsers = useMemo(() => {
    return users.filter((user: User) => {
      const userId = user._id || user.id;
      return userId && selectedUserIds.has(userId);
    });
  }, [users, selectedUserIds]);

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setPreviewImage(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [image]);

  const handleNameChange = (newName: string) => {
    setName(newName);
  };

  const handleImageChange = (newImage: File | null) => {
    setImage(newImage);
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const resetForm = () => {
    setName("");
    setSelectedUserIds(new Set());
    setImage(null);
    setPreviewImage(null);
    setSearchQuery("");
  };

  const validateForm = () => {
    if (selectedUserIds.size === 0) {
      throw new Error("Please select at least one user");
    }
    if (!name.trim()) {
      throw new Error("Please enter a group name");
    }
  };

  const handleSubmit = useCallback(async () => {
    try {
      validateForm();

      const participantIds = Array.from(selectedUserIds);

      const currentUserId = user?.id || user?._id;
      if (currentUserId && !participantIds.includes(currentUserId)) {
        participantIds.push(currentUserId);
      }

      if (participantIds.length < 2) {
        throw new Error("A group chat requires at least 2 participants");
      }

      const formattedParticipants = participantIds.map((userId) => ({
        userId,
      }));

      const type = "group";
      const description = "Group conversation";
      const createGroup = {
        type,
        participants: formattedParticipants,
        name,
        description,
      };
      // socket?.emit(
      //   "conversation:create",
      //   createGroup,
      //   (error: any, response: any) => {
      //     if (error) {
      //       toast.error(error.message || "Failed to create group.");
      //       return;
      //     }
      //     toast.success("Group created successfully!");
      //     resetForm();
      //     onClose();
      //   }
      // );
      await createChat(createGroup as any);
      toast.success("Group created successfully!");
      resetForm();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Error creating group.");
    }
  }, [name, selectedUserIds, user, onClose, createChat]);

  const handleNext = useCallback(() => {
    if (step === "members") {
      if (selectedUserIds.size > 0) {
        setStep("details");
      } else {
        toast.error("Please select at least one user");
      }
    } else if (step === "details") {
      handleSubmit();
    }
  }, [step, selectedUserIds.size, handleSubmit]);

  return (
    <div className="absolute inset-0">
      <div onClick={onClose} className="absolute inset-0 bg-card" />
      <div className="relative h-full w-full flex flex-col p-4  rounded-lg">
        <StepContainer isActive={step === "members"} step={step}>
          <div className="flex flex-col h-full">
            <header className="flex items-center justify-between  gap-4 mb-8">
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

              <h2 className="text-2xl font-semibold">
                Add Members ({selectedUsers.length})
              </h2>

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
              {selectedUsers.length > 0 && (
                <SelectUserList users={selectedUsers} />
              )}
            </div>

            <div className="flex-1 overflow-y-auto mb-4">
              <UserList
                users={usersData}
                selectedUserIds={selectedUserIds}
                onUserToggle={handleUserToggle}
                loading={isLoading}
              />
            </div>

            <div className="flex justify-end">
              <NavigationButton
                onClick={handleNext}
                disabled={selectedUserIds.size === 0}
                icon={ArrowRight}
                text="Next"
              />
            </div>
          </div>
        </StepContainer>

        <StepContainer isActive={step === "details"} step={step}>
          <div className="flex flex-col h-full">
            <header className="flex items-center justify-between gap-4 mb-8">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full p-2 hover:bg-primary/10 hover:text-primary transition-colors"
                title="Back"
                onClick={() => setStep("members")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <h2 className="text-2xl font-semibold">Group Details</h2>

              <div className="w-10" />
            </header>

            <div className="flex-1 overflow-y-auto mb-4">
              <GroupDetailsForm
                name={name}
                image={image}
                previewImage={previewImage}
                onNameChange={handleNameChange}
                onImageChange={handleImageChange}
              />
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep("members")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!name.trim()}
                className="flex items-center gap-2"
              >
                Create Group
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </StepContainer>

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

export default CreateGroupChat;
