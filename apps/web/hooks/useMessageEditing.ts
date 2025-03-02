import { useState, useCallback } from "react";
import { socketService } from "@/services/socket/socketService";

export function useMessageEdit(initialContent: string, messageId: string) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(initialContent);

  const handleEdit = useCallback(() => {
    if (editedContent.trim() && editedContent !== initialContent) {
      socketService.editMessage(messageId, editedContent);
    }
    setIsEditing(false);
  }, [editedContent, initialContent, messageId]);

  return {
    isEditing,
    editedContent,
    setEditedContent,
    setIsEditing,
    handleEdit,
  };
}
