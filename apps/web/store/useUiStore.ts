import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isMobile: false,
      setIsMobile: (isMobile: boolean) => set({ isMobile }),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({ isMobile: state.isMobile }),
    }
  )
);
