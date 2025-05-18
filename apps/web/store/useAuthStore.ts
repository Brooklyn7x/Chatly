import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import { me } from "@/services/userService";
import { loginUser, logoutUser, register } from "@/services/authService";

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await loginUser({ email, password });
          const user = response.data.user;
          set({ user, isAuthenticated: !!user, isLoading: false });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: "Login failed",
          });
        }
      },

      register: async (username: string, email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await register({ username, email, password });
          const user = response.data.user;
          if (!response.data.success) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return;
          }
          set({ user, isAuthenticated: !!user, isLoading: false });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: "Registration failed",
          });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await logoutUser();
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await me();
          console.log("checkAuth response", response);
          if (!response.data.user) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return;
          }
          set({
            isLoading: false,
            error: null,
            isAuthenticated: !!response.data.user,
            user: response.data.user,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: "Authentication failed",
          });
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
