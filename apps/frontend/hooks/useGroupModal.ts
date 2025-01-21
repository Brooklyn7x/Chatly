import socketService from "@/services/socket";
import { useChatStore } from "@/store/useChatStore";
import useUserStore from "@/store/useUserStore";
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";

interface GroupFormData {
  name: string;
  image: File | null;
  selectedUserIds: Set<string>;
}

export const useGroupModal = (isOpen: boolean, onClose: () => void) => {
  const [shouldRender, setShouldRender] = useState(false);
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

  const { searchUsers, searchResults, loading } = useUserStore();

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

  const selectedUsers = useMemo(
    () =>
      searchResults.filter((user) => formData.selectedUserIds.has(user._id)),
    [searchResults, formData.selectedUserIds]
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
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      if (formData.selectedUserIds.size === 0) {
        toast.error("Please select at least one user");
        return;
      }

      if (formData.name.trim()) {
        toast.error("Please enter a group name");
        return;
      }

      const selectedUserIds = Array.from(formData.selectedUserIds);

      const groupResponse = await socketService.createGroup({
        name: formData.name.trim(),
        participantIds: selectedUserIds,
      });

      if (!groupResponse.conversationId) {
        toast.error("Failed to create group chat");
        throw new Error("Failed to create group conversation");
      }

      const selectedUsers = searchResults.filter((user) =>
        formData.selectedUserIds.has(user._id)
      );
      useChatStore.getState().createChat(selectedUsers, formData.name);
      onClose();
    } catch (error) {
      toast.error("Failed to create group");
      console.error("Failed to create group:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    shouldRender,
    step,
    searchQuery,
    previewImage,
    loading,
    error,
    formData,
    selectedUsers,
    handleImageChange,
    handleUserToggle,
    handleGroupNameChange,
    handleNext,
    setSearchQuery,
    searchResults,
    setStep,
  };
};
