import { create } from "zustand";

interface Chatpanel {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useChatPanelStore = create<Chatpanel>()((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
