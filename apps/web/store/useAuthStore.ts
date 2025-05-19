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
  login: (username: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
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
          const user = response.data;

          if (user) {
            set({ user, isAuthenticated: true, isLoading: false, error: null });
            return true;
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: "Invalid credentials",
            });
            return false;
          }
        } catch (error : any) {
          const err = error.response?.data.message || "Login failed";
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: err,
          });
          return false;
        }
      },

      register: async (username: string, email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await register({ username, email, password });
          const user = response?.data;
          if (!response.data.success) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return false;
          }
          set({ user, isAuthenticated: !!user, isLoading: false });
          return true;
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: "Registration failed",
          });
          return false;
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
          const user = response.data.user;
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return false;
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: "Authentication failed",
          });
          return false;
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
