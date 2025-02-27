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
  const socketRef = useRef<any>();
  const { accessToken } = useAuthStore();
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
    if (!accessToken) return;

    const updateConnectionState = () => {
      if (socketService) {
        const state = socketService.getConnectionState();
        setConnectionState((prev) => ({
          ...prev,
          isConnected: state.connected,
          isConnecting: state.connecting,
          isHealthy: state.healthy,
          reconnectCount: state.reconnectAttempts,
        }));
      }
    };

    // Update state immediately and then every 2 seconds
    updateConnectionState();
    const interval = setInterval(updateConnectionState, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    // If we have a token but haven't initialized, do it now
    if (!hasInitializedRef.current) {
      console.log("Initial socket connection after login");
      socketRef.current = socketService.initialize(accessToken);
      hasInitializedRef.current = true;
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    // Prevent multiple initializations with the same token
    if (hasInitializedRef.current && socketService.isConnected()) {
      console.log("Socket already initialized and connected, skipping");
      return;
    }
    console.log("Setting up socket connection in hook");
    // Add event listeners
    socketService.on("connected", handleConnect);
    socketService.on("disconnected", handleDisconnect);
    socketService.on("connect_error", handleError);

    // Initialize socket
    socketRef.current = socketService.initialize(accessToken);
    hasInitializedRef.current = true;

    // Update connection state
    setConnectionState((prev) => ({
      ...prev,
      isConnecting: true,
    }));

    return () => {
      console.log("Cleaning up socket listeners in hook");
      socketService.off("connected", handleConnect);
      socketService.off("disconnected", handleDisconnect);
      socketService.off("connect_error", handleError);
      // Don't disconnect here, only remove listeners
    };
  }, [accessToken]); // Remove callback dependencies to prevent unnecessary re-runs

  useEffect(() => {
    return () => {
      console.log("Component unmounting, disconnecting socket");
      hasInitializedRef.current = false;
      socketService.disconnect();
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected: connectionState.isConnected && connectionState.isHealthy,
    isConnecting: connectionState.isConnecting,
    connectionError: connectionState.connectionError,
    reconnectCount: connectionState.reconnectCount,
    connectionState,
  };
}
