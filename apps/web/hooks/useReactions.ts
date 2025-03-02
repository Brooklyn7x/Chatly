import { useState } from "react";
import { socketService } from "@/services/socket/socketService";

export function useReactions(messageId: string) {
  const [reactions, setReactions] = useState<string[]>([]);

  const addReaction = (reaction: string) => {
    setReactions((prev) => [...prev, reaction]);
    // socketService.addReaction(messageId, reaction);
  };

  const removeReaction = (index: number) => {
    setReactions((prev) => prev.filter((_, i) => i !== index));
    // socketService.removeReaction(messageId, index);
  };

  return {
    reactions,
    addReaction,
    removeReaction,
  };
}
