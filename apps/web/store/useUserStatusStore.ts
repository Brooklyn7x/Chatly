import { create } from "zustand";

export type UserStatus =
  | "online"
  | "offline"
  | "away"
  | "idle"
  | "do_not_disturb";

export interface UserStatusData {
  userId: string;
  status: UserStatus;
  lastSeen: string;
}

interface UserStatusState {
  userId: string;
  status: UserStatus;
  lastSeen: Date;
}

interface UserStatusStore {
  statusMap: Record<string, UserStatusState>;
  getStatus: (userId: string) => UserStatusState | null;
  updateStatus: (data: UserStatusState) => void;
}

export const useUserStatusStore = create<UserStatusStore>((set, get) => ({
  statusMap: {},
  getStatus: (userId) => get().statusMap[userId] || null,
  updateStatus: (data) =>
    set((state) => ({
      statusMap: {
        ...state.statusMap,
        [data.userId]: {
          userId: data.userId,
          status: data.status,
          lastSeen: data.lastSeen,
        },
      },
    })),
}));

export default useUserStatusStore;
