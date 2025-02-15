import { create } from "zustand";

interface TypingState {
  typingMap: Record<string, string[]>; 
  setTypingUsers: (conversationId: string, userIds: string[]) => void;
}

export const useTypingStore = create<TypingState>((set) => ({
  typingMap: {},
  setTypingUsers: (conversationId, userIds) =>
    set((state) => ({
      typingMap: {
        ...state.typingMap,
        [conversationId]: userIds,
      },
    })),
}));
