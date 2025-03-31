import { create } from "zustand";
import { initializeSocket, disconnectSocket } from "@/utils/sockets";
import { Socket } from "socket.io-client";
import useAuthStore from "./useAuthStore";

interface SocketStore {
  socket: Socket | null;
  isConnected: boolean;
  error: Error | null;
  connect: () => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  isConnected: false,
  error: null,

  connect: () => {
    const token = useAuthStore.getState().accessToken;

    if (!token) {
      set({ error: new Error("No authentication token available") });
      return;
    }
    try {
      const socket = initializeSocket({ token });

      socket.on("connect", () => {
        set({ socket, isConnected: true, error: null });
      });

      socket.on("disconnect", () => {
        set({ isConnected: false });
      });

      socket.on("connect_error", (error) => {
        set({ error: new Error(error.message) });
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error : new Error("Connection failed"),
      });
    }
  },
  disconnect: () => {
    set((state) => {
      if (state.socket) {
        state.socket.off("connect");
        state.socket.off("disconnect");
        state.socket.off("connect_error");

        state.socket.disconnect();
      }
      return { socket: null, isConnected: false, error: null };
    });
  },
}));
