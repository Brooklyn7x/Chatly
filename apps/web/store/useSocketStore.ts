import { socketService } from "@/services/socket/socketService";
import { create } from "zustand";

interface SocketStore {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketStore>()((set) => ({
  isConnected: false,
  connect: () => {
    try {
      socketService.initialize();
      set({ isConnected: true });
    } catch (error) {
      console.error("Socket initialization failed:", error);
    }
  },
  disconnect: () => {
    socketService.disconnect();
    set({ isConnected: false });
  },
}));
