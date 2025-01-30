import { User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  users: User[];
  searchResults: User[];
  loading: boolean;
  error: string | null;
}

interface UserActions {
  searchUsers: (users: User[]) => void;
}

type UserStore = UserState & UserActions;

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      users: [],
      searchResults: [],
      loading: false,
      error: null,

      searchUsers: (users) => {
        set({ users });
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        users: state.users,
      }),
    }
  )
);

export default useUserStore;
