import { create } from "zustand";

interface UserStatusStore {
  userStatus: Record<string, string>;
  setUserStatus: (userId: string, status: string) => void;
  clearUserStatus: () => void;
}

const useUserStatusStore = create<UserStatusStore>((set) => ({
  userStatus: {},
  setUserStatus: (userId, status) => {
    set((state) => ({
      userStatus: { ...state.userStatus, [userId]: status },
    }));
  },
  clearUserStatus: () => set({ userStatus: {} }),
}));

export default useUserStatusStore;
