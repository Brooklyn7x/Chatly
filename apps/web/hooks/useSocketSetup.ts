import useAuthStore from "@/store/useAuthStore";
import { useSocketStore } from "@/store/useSocketStore";
import { useEffect } from "react";

export function useSocketSetup() {
  const { connect, disconnect } = useSocketStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) {
      disconnect();
      return;
    }
    connect();

    return () => {
      disconnect();
    };
  }, [accessToken]);
}
