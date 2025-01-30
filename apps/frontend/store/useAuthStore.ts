import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import axios from "axios";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  // refreshSession: () => Promise<void>;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: (token, user) => {
        set({ token, user, isAuthenticated: true, error: null });
      },

      // login: (token, user) => {
      //   set({ isAuthenticated :  });
      //   try {
      //     const response = await api.post("/api/auth/login", {
      //       email,
      //       password,
      //     });
      //     const { user, accessToken, refreshToken } = response.data;

      //     axios.defaults.headers.common["Authorization"] =
      //       `Bearer ${accessToken}`;

      //     set({
      //       user: user.data,
      //       accessToken,
      //       refreshToken,
      //       isAuthenticated: true,
      //       error: null,
      //     });
      //   } catch (error: any) {
      //     set({
      //       error: error.response?.data?.error || "Login failed",
      //       isAuthenticated: false,
      //     });
      //     throw error;
      //   } finally {
      //     set({ isLoading: false });
      //   }
      // },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },

      // refreshSession: async () => {
      //   const refreshToken = get().refreshToken;
      //   if (!refreshToken) return;

      //   try {
      //     const response = await api.post("/auth/refresh-token", {
      //       refreshToken,
      //     });
      //     const { accessToken: newAccessToken } = response.data;

      //     console.log(response.data, "refresh");

      //     axios.defaults.headers.common["Authorization"] =
      //       `Bearer ${newAccessToken}`;

      //     set({
      //       accessToken: newAccessToken,
      //       user: response.data.user.data,
      //       isAuthenticated: true,
      //     });
      //   } catch (error) {
      //     get().logout();
      //   }
      // },
      // }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
