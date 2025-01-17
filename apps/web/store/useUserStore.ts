import { User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

interface UserState {
  users: User[];
  searchResults: User[];
  loading: boolean;
  error: string | null;
}

interface UserActions {
  searchUsers: (query?: string) => Promise<void>;
}

type UserStore = UserState & UserActions;

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      users: [],
      searchResults: [],
      loading: false,
      error: null,

      searchUsers: async (query?: string) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(
            "http://localhost:8000/users/search",
            {
              params: { query: query?.trim() },
            }
          );

          if (response.data.success) {
            set({
              searchResults: response.data.data.users,
              loading: false,
            });
          } else {
            throw new Error(response.data.error);
          }
        } catch (error: any) {
          set({
            error: error?.response?.data?.error || "Failed to search users",
            loading: false,
            searchResults: [],
          });
        }
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
