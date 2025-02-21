import { useUserStatusStore } from "@/store/useUserStatusStore";

export const useUserStatus = (userId: string) => {
  const status = useUserStatusStore((state) =>
    userId ? state.statusMap[userId] : null
  );

  return {
    status: status?.status || "offline",
    lastSeen: status?.lastSeen || "",
    isOnline: status?.status === "online",
    getStatusText: () => {
      if (!status) return "offline";
      if (status.status === "online") return "Online";
      return `Last seen ${new Date(status.lastSeen).toDateString()}`;
    },
  };
};
