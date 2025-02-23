import { useUserStatusStore } from "@/store/useUserStatusStore";

export const useUserStatus = (userId: string) => {
  const status = useUserStatusStore((state) =>
    userId ? state.statusMap[userId] : null
  );

  return {
    status: status?.status || "offline",
    timestamp: status?.timestamp || "",
    isOnline: status?.status === "online",
    getStatusText: () => {
      if (!status) return "Offline";
      if (status.status === "online") return "Online";
      return `Last seen ${new Date(status.timestamp).toLocaleString()}`;
    },
  };
};
