import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import { me } from "@/services/userService";
import { loginUser, logoutUser, register } from "@/services/authService";

interface AuthStore {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      isLoggedIn: false,

      fetchUser: async () => {
        try {
          set({ loading: true });
          const response = await me();
          const data = response.data.user;

          set({ user: data, isLoggedIn: !!data, loading: false });
        } catch (error) {
          set({ user: null, isLoggedIn: false, loading: false });
          throw error;
        }
      },

      login: async (email: string, password: string) => {
        try {
          set({ loading: true });
          const response = await loginUser({ email, password });
          const data = response.data;

          set({ user: data, isLoggedIn: !!data, loading: false });
        } catch (error) {
          set({ user: null, isLoggedIn: false, loading: false });
          throw error;
        }
      },

      register: async (username: string, email: string, password: string) => {
        try {
          set({ loading: true });
          const response = await register({ username, email, password });
          const user = response.data.user;
          set({ user, isLoggedIn: !!user, loading: false });
        } catch (error) {
          set({ user: null, isLoggedIn: false, loading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ loading: true });
          await logoutUser();
          set({ user: null, isLoggedIn: false, loading: false });
        } catch (error) {
          set({ user: null, isLoggedIn: false, loading: false });
          throw error;
        }
      },

      setUser: (user: User | null) => set({ user }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
