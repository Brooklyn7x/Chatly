import { useState, useEffect } from "react";
import { useSocket } from "./useSocket";

export function useConnectionStatus() {
  const { isConnected, isConnecting, connectionError, reconnectCount } =
    useSocket();

  const [showConnectionAlert, setShowConnectionAlert] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isConnecting) {
      setShowConnectionAlert(true);
      setReconnecting(false);
    } else if (!isConnected) {
      setReconnecting(reconnectCount > 0);
      timer = setTimeout(() => {
        setShowConnectionAlert(true);
      }, 2000);
    } else {
      setShowConnectionAlert(true);
      timer = setTimeout(() => {
        setShowConnectionAlert(false);
      }, 1500);
      setReconnecting(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isConnected, isConnecting, reconnectCount]);

  const connectionStatus = {
    color: isConnecting
      ? "blue"
      : reconnecting
        ? "amber"
        : isConnected
          ? "green"
          : "red",
    message: isConnecting
      ? "Connecting to chat server..."
      : reconnecting
        ? `Reconnecting to chat server (attempt ${reconnectCount})...`
        : isConnected
          ? "Connected to chat server"
          : connectionError || "Connection error",
    showConnectionAlert,
  };

  return { connectionStatus };
}
