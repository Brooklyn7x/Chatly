import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import { resetAllStores } from "@/utils/store-reset";
import { loginUser, register } from "@/services/authService";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (data: any) => void;
  register: (data: any) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  setToken: (token: string) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data: any) => {
        try {
          set({ isLoading: true, error: null });
          const response = await loginUser(data);
          
          set({
            user: response.data,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.response.data.message
                : "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data: any) => {
        try {
          set({ isLoading: true, error: null });

          const response = await register(data);

          set({
            user: response.data,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem("refreshToken", response.refreshToken);
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Registration failed",
          });
          throw error;
        }
      },

      logout: () => {
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        resetAllStores();
      },

      updateUser: (user) => {
        set((state) => ({
          ...state,
          user: { ...state.user, ...user },
        }));
      },
      setToken: () => {},

      clearError: () => {},
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
