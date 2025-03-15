import { useCallback, useState } from "react";

export const useGroupChatForm = () => {
  const [formData, setFormData] = useState<any>({
    name: "",
    image: null,
    selectedUserIds: new Set(),
  });

  const handleImageChange = useCallback((file: File | null) => {
    if (file) {
      setFormData((prev: any) => ({ ...prev, image: file }));
    }
  }, []);

  const handleUserToggle = useCallback((userId: string) => {
    setFormData((prev: any) => {
      const newSelectedIds = new Set(prev.selectedUserIds);
      newSelectedIds.has(userId)
        ? newSelectedIds.delete(userId)
        : newSelectedIds.add(userId);
      return { ...prev, selectedUserIds: newSelectedIds };
    });
  }, []);

  const handleNameChange = useCallback((name: string) => {
    setFormData((prev: any) => ({ ...prev, name }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      image: null,
      selectedUserIds: new Set(),
    });
  }, []);

  return {
    formData,
    handleImageChange,
    handleUserToggle,
    handleNameChange,
    resetForm,
    setFormData,
  };
};
