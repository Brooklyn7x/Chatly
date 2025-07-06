import { create } from "zustand";
import { Socket } from "socket.io-client";
import { initializeSocket } from "@/utils/sockets";
import { toast } from "sonner";

interface SocketStore {
  // Connection State
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  reconnectAttempts: number;
  maxReconnectAttempts: number;

  // Connection Actions
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;

  // Event Actions
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;

  // State Actions
  setConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  incrementReconnectAttempts: () => void;
  resetReconnectAttempts: () => void;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  // Initial State
  socket: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,

  // Connection Actions
  connect: () => {
    const state = get();

    // Don't connect if already connected or connecting
    if (state.isConnected || state.isConnecting) {
      return;
    }

    try {
      set({ isConnecting: true, error: null });

      const socket = initializeSocket({
        reconnectionAttempts: state.maxReconnectAttempts,
        reconnectionDelay: 1000,
        timeout: 20000,
      });

      // Connection event handlers
      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
        set({
          socket,
          isConnected: true,
          isConnecting: false,
          error: null,
          reconnectAttempts: 0,
        });
        toast.success("Connected to server");
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        set({
          isConnected: false,
          isConnecting: false,
        });

        // Show toast only for unexpected disconnections
        if (reason !== "io client disconnect") {
          toast.warning("Disconnected from server");
        }
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        const errorMessage = error.message || "Connection failed";

        set((state) => ({
          error: errorMessage,
          isConnecting: false,
          reconnectAttempts: state.reconnectAttempts + 1,
        }));

        // Show error toast if max attempts reached
        if (get().reconnectAttempts >= get().maxReconnectAttempts) {
          toast.error("Unable to connect to server. Please refresh the page.");
        }
      });

      socket.on("reconnect", (attemptNumber) => {
        console.log("Socket reconnected after", attemptNumber, "attempts");
        set({
          isConnected: true,
          error: null,
          reconnectAttempts: 0,
        });
        toast.success("Reconnected to server");
      });

      socket.on("reconnect_error", (error) => {
        console.error("Socket reconnection error:", error);
        set((state) => ({
          error: error.message || "Reconnection failed",
          reconnectAttempts: state.reconnectAttempts + 1,
        }));
      });

      socket.on("reconnect_failed", () => {
        console.error("Socket reconnection failed");
        set({
          error: "Failed to reconnect to server",
          isConnecting: false,
        });
        toast.error("Failed to reconnect. Please refresh the page.");
      });

      // Store socket instance
      set({ socket });
    } catch (error) {
      console.error("Failed to initialize socket:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Connection failed";
      set({
        error: errorMessage,
        isConnecting: false,
        socket: null,
      });
      toast.error("Failed to connect to server");
    }
  },

  disconnect: () => {
    const { socket } = get();

    if (socket) {
      // Remove all event listeners
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("reconnect");
      socket.off("reconnect_error");
      socket.off("reconnect_failed");

      // Disconnect socket
      socket.disconnect();
    }

    set({
      socket: null,
      isConnected: false,
      isConnecting: false,
      error: null,
      reconnectAttempts: 0,
    });
  },

  reconnect: () => {
    const { disconnect, connect } = get();
    disconnect();
    setTimeout(() => {
      connect();
    }, 1000);
  },

  // Event Actions
  emit: (event: string, data?: any) => {
    const { socket, isConnected } = get();

    if (!socket || !isConnected) {
      console.warn(`Cannot emit event "${event}": Socket not connected`);
      toast.warning("Not connected to server");
      return;
    }

    try {
      socket.emit(event, data);
    } catch (error) {
      console.error(`Failed to emit event "${event}":`, error);
      toast.error("Failed to send message");
    }
  },

  on: (event: string, callback: (...args: any[]) => void) => {
    const { socket } = get();

    if (!socket) {
      console.warn(`Cannot listen to event "${event}": Socket not available`);
      return;
    }

    socket.on(event, callback);
  },

  off: (event: string, callback?: (...args: any[]) => void) => {
    const { socket } = get();

    if (!socket) {
      return;
    }

    if (callback) {
      socket.off(event, callback);
    } else {
      socket.off(event);
    }
  },

  // State Actions
  setConnected: (connected: boolean) => set({ isConnected: connected }),

  setError: (error: string | null) => set({ error }),

  clearError: () => set({ error: null }),

  incrementReconnectAttempts: () =>
    set((state) => ({
      reconnectAttempts: state.reconnectAttempts + 1,
    })),

  resetReconnectAttempts: () => set({ reconnectAttempts: 0 }),
}));
export default useSocketStore;
