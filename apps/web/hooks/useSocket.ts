import { useEffect, useRef } from "react";
import { socketService } from "@/services/socket/socketService";
import useAuthStore from "@/store/useAuthStore";

export function useSocket() {
  const socketRef = useRef<any>();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;
    socketRef.current = socketService.initialize(accessToken);

    return () => {
      if (socketRef.current) {
        socketService.disconnect();
      }
    };
  }, [accessToken]);

  return socketRef.current;
}
