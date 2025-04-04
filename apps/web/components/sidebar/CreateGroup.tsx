"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, UserPlus, X } from "lucide-react";
import { GroupDetailsForm } from "../form/GroupDetailsForm";
import { StepContainer } from "../modal/StepContainer";
import { UserList } from "../user/UserList";
import { SelectUserList } from "../user/SelectedUserList";
import { SearchInput } from "../shared/SearchInput";
import { NavigationButton } from "../shared/NavigationButton";
import FloatinButton from "../shared/FloatinButton";
import { Loading } from "../ui/loading";
import { useFetchContacts, useSearchUser } from "@/hooks/useContact";
import useAuthStore from "@/store/useAuthStore";
import { User } from "@/types";
import { useCreateChat } from "@/hooks/useChats";
import { useSocketStore } from "@/store/useSocketStore";
import { Button } from "../ui/button";
import AddNewContact from "./AddNewContact";

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
  const { user } = useAuthStore();
  const { users } = useSearchUser(searchQuery);
  const { contacts, isLoading } = useFetchContacts();

  const { socket } = useSocketStore();

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

      socket?.emit(
        "conversation:create",
        createGroup,
        (error: any, response: any) => {
          if (error) {
            toast.error(error.message || "Failed to create group.");
            return;
          }
          toast.success("Group created successfully!");
          resetForm();
          onClose();
        }
      );
    } catch (error: any) {
      toast.error(error.message || "Error creating group.");
    }
  }, [name, selectedUserIds, user, onClose, socket]);

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
    <div className="fixed inset-0">
      <div onClick={onClose} className="absolute inset-0 bg-black opacity-30" />
      <div className="relative h-full w-full flex flex-col p-4 bg-background rounded-lg">
        <StepContainer isActive={step === "members"} step={step}>
          <div className="flex flex-col h-full">
            <header className="flex items-center justify-between  gap-4 mb-8">
              <NavigationButton onClick={onClose} icon={X} />
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

            {isLoading ? (
              <div className="my-4 flex justify-center">
                <Loading />
              </div>
            ) : usersData.length === 0 ? (
              <div className="text-center text-muted-foreground mt-8">
                No users found. Try a different search term.
              </div>
            ) : (
              <UserList
                users={usersData}
                selectedUserIds={selectedUserIds}
                onUserToggle={handleUserToggle}
              />
            )}
          </div>
        </StepContainer>

        <StepContainer isActive={step === "details"} step={step}>
          <div className="flex flex-col h-full">
            <header className="flex items-center gap-4 mb-8">
              <NavigationButton
                onClick={() => setStep("members")}
                icon={ArrowLeft}
              />
              <h2 className="text-2xl font-semibold">Group Details</h2>
            </header>

            <GroupDetailsForm
              name={name}
              onNameChange={handleNameChange}
              previewImage={previewImage || undefined}
              onImageChange={handleImageChange}
            />
          </div>
        </StepContainer>
      </div>

      <div className="absolute right-6 bottom-6">
        <FloatinButton
          onClick={handleNext}
          disabled={
            (step === "members" && selectedUserIds.size === 0) ||
            (step === "details" && !name.trim())
          }
        >
          <ArrowRight className="h-5 w-5" />
        </FloatinButton>
      </div>

      <AddNewContact
        open={addContact}
        onOpenChange={() => setAddContact(false)}
      />
    </div>
  );
};

export default CreateGroupChat;
