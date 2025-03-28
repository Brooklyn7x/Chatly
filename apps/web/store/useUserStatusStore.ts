import { create } from "zustand";

export type UserStatus = "online" | "offline";

interface UserStatusState {
  userId: string;
  status: UserStatus;
  timestamp: string;
}

interface UserStatusStore {
  statusMap: Record<string, UserStatusState>;
  getStatus: (userId: string) => UserStatusState | string;
  updateStatus: (data: UserStatusState) => void;
}

export const useUserStatusStore = create<UserStatusStore>((set, get) => ({
  statusMap: {},
  getStatus: (userId) => get().statusMap[userId] || "offline",
  updateStatus: (data) =>
    set((state) => ({
      statusMap: {
        ...state.statusMap,
        [data.userId]: {
          userId: data.userId,
          status: data.status,
          timestamp: data.timestamp,
        },
      },
    })),
}));

export default useUserStatusStore;
