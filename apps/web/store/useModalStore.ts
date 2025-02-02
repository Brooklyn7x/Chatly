import { create } from "zustand";

interface ModalStore {
  channelModal: boolean;
  groupModal: boolean;
  openChannelModal: () => void;
  closeChannelModal: () => void;
  openGroupModal: () => void;
  closeGroupModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  channelModal: false,
  groupModal: false,
  openChannelModal: () => set({ channelModal: true }),
  closeChannelModal: () => set({ channelModal: false }),
  openGroupModal: () => set({ groupModal: true }),
  closeGroupModal: () => set({ groupModal: false }),
}));
