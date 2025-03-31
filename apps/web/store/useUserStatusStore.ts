import { create } from "zustand";

interface UserStatus {
  userId: string;
  status: string;
  lastUpdated: Date;
}

interface UserStatusStore {
  userStatuses: Record<string, UserStatus>;
  updateUserStatus: (userId: string, status: string) => void;
  getUserStatus: (userId: string) => UserStatus | undefined;
}

export const useUserStatusStore = create<UserStatusStore>((set, get) => ({
  userStatuses: {},

  updateUserStatus: (userId, status) =>
    set((state) => ({
      userStatuses: {
        ...state.userStatuses,
        [userId]: {
          userId,
          status,
          lastUpdated: new Date(),
        },
      },
    })),

  getUserStatus: (userId) => get().userStatuses[userId],
}));

export default useUserStatusStore;
