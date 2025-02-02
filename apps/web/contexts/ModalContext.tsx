"use client";

import { AppModals } from "@/components/layout/AppModals";
import { createContext, useContext, useState } from "react";

interface ModalContextType {
  channelModal: boolean;
  groupModal: boolean;
  openChannelModal: () => void;
  closeChannelModal: () => void;
  openGroupModal: () => void;
  closeGroupModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [channelModal, setChannelModal] = useState(false);
  const [groupModal, setGroupModal] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        channelModal,
        groupModal,
        openChannelModal: () => setChannelModal(true),
        closeChannelModal: () => setChannelModal(false),
        openGroupModal: () => setGroupModal(true),
        closeGroupModal: () => setGroupModal(false),
      }}
    >
      {children}
      <AppModals />
    </ModalContext.Provider>
  );
}

export const useModals = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModals must be used within a ModalProvider");
  }
  return context;
};
