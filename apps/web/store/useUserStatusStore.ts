import { create } from "zustand";

export type UserStatus = "online" | "offline";

export interface UserStatusData {
  userId: string;
  status: UserStatus;
  lastSeen?: string;
}

interface UserStatusStore {
  userStatus: Record<string, UserStatus>;
  setUserStatus: (userId: string, status: UserStatus) => void;
}

export const useUserStatusStore = create<UserStatusStore>((set) => ({
  userStatus: {},
  setUserStatus: (userId, status) =>
    set((state) => ({
      userStatus: {
        ...state.userStatus,
        [userId]: status,
      },
    })),
}));

export default useUserStatusStore;
