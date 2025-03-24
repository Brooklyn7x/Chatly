import { useEffect, useRef, useState, useCallback } from "react";
import { socketService } from "@/services/socket/socketService";
import useAuthStore from "@/store/useAuthStore";

interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  isHealthy: boolean;
  reconnectCount: number;
  connectionError: string | null;
}

export function useSocket() {
  const { accessToken } = useAuthStore();
  const socketRef = useRef<any>();
  const hasInitializedRef = useRef<boolean>(false);

  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnected: false,
    isConnecting: false,
    isHealthy: true,
    reconnectCount: 0,
    connectionError: null,
  });

  const handleConnect = useCallback(() => {
    console.log("Socket connected in hook");
    setConnectionState((prev) => ({
      ...prev,
      isConnected: true,
      isConnecting: false,
      isHealthy: true,
      connectionError: null,
      reconnectCount: 0,
    }));
  }, []);

  const handleDisconnect = useCallback((reason: string) => {
    console.log("Socket disconnected in hook:", reason);
    setConnectionState((prev) => ({
      ...prev,
      isConnected: false,
      isHealthy: false,
    }));
  }, []);

  const handleError = useCallback((error: any) => {
    console.log("Socket error in hook:", error);
    setConnectionState((prev) => ({
      ...prev,
      isConnected: false,
      isHealthy: false,
      connectionError: error.message || "Connection error",
      reconnectCount: prev.reconnectCount + 1,
    }));
  }, []);

  useEffect(() => {
    if (!accessToken) {
      console.log("No access token, disconnecting socket");
      return;
    }

    if (!hasInitializedRef.current) {
      console.log("Initializing new socket connection");
      socketRef.current = socketService.initialize(accessToken);
      hasInitializedRef.current = true;
    }

    socketService.on("connected", handleConnect);
    socketService.on("disconnected", handleDisconnect);
    socketService.on("connect_error", handleError);

    return () => {
      console.log("Cleaning up socket connection (unmount or HMR)");
      socketService.off("connected", handleConnect);
      socketService.off("disconnected", handleDisconnect);
      socketService.off("connect_error", handleError);

      if (!accessToken) {
        console.log("Logging out, disconnecting socket");
        socketService.disconnect();
        hasInitializedRef.current = false;
      }
    };
  }, [accessToken]);

  return {
    socket: socketRef.current,
    isConnected: connectionState.isConnected && connectionState.isHealthy,
    isConnecting: connectionState.isConnecting,
    connectionError: connectionState.connectionError,
    reconnectCount: connectionState.reconnectCount,
    connectionState,
  };
}
