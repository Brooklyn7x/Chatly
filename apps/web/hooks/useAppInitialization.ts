import useAuthStore from "@/store/useAuthStore";
import { useSocketStore } from "@/store/useSocketStore";
import { useEffect } from "react";
import { useChats } from "./useChats";
import { useNotifications } from "./useNotifications";

export function useAppInitialization() {
  const { accessToken } = useAuthStore();
  const { connect, disconnect } = useSocketStore();
  const { fetchChats } = useChats();
  const { initializeNotifications } = useNotifications();

  useEffect(() => {
    if (!accessToken) {
      disconnect();
      return;
    }
    connect();
    fetchChats();
    return () => {
      disconnect();
    };
  }, []);

  return;
}
