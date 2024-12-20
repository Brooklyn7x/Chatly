import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/types";
import axios from "axios";

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  login: (email: string, password: string) => void;
  register: (email: string, password: string, username: string) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  initialize: () => Promise<void>;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      isInitialized: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            "http://localhost:8000/auth/login",
            {
              email,
              password,
            }
          );
          const { user, accessToken, refreshToken } = response.data;

          axios.defaults.headers.common["Authorization"] =
            `Bearer ${accessToken}`;

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Login failed",
            isAuthenticated: false,
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (email: string, password: string, username: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            "http://localhost:8000/auth/register",
            {
              email,
              password,
              username,
            }
          );

          const { user, accessToken, refreshToken } = response.data;

          axios.defaults.headers.common["Authorization"] =
            `Bearer ${accessToken}`;

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Registration failed",
            isAuthenticated: false,
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      logout: async () => {
        try {
          // await axios.post("http://localhost:8000/auth/logout");
        } finally {
          delete axios.defaults.headers.common["Authorization"];
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      },

      refreshSession: async () => {
        const refreshToken = get().refreshToken;
        if (!refreshToken) return;

        try {
          const response = await axios.post(
            "http://localhost:8000/auth/refresh-token",
            {
              refreshToken,
            }
          );

          const { accessToken: newAccessToken } = response.data;

          axios.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;

          set({ accessToken: newAccessToken });
        } catch (error) {
          get().logout();
        }
      },

      initialize: async () => {
        // set({ isLoading: true });
        // const { accessToken, refreshToken } = get();
        // if (!accessToken) {
        //   set({ isLoading: false });
        //   return;
        // }

        // try {
        //   // const { accessToken, refreshToken } = JSON.parse(tokens);
        //   // console.log(accessToken);
        //   const response = await axios.get(
        //     "http://localhost:8000/auth/verify",
        //     {
        //       headers: {
        //         Authorization: `Bearer ${accessToken}`,
        //         "Content-Type": "application/json",
        //       },
        //     }
        //   );

        //   set({
        //     accessToken,
        //     refreshToken,
        //     user: response.data.user,
        //     isAuthenticated: true,
        //     error: null,
        //   });

        //   axios.defaults.headers.common["Authorization"] =
        //     `Bearer ${accessToken}`;
        // } catch (error) {
        //   localStorage.removeItem("auth-storage");
        //   set({
        //     accessToken: null,
        //     refreshToken: null,
        //     user: null,
        //     isAuthenticated: false,
        //     error: "",
        //   });
        // }

        try {
          const { accessToken, refreshToken } = get();
          if (!accessToken) {
            set({ isLoading: false });
          }

          const response = await axios.get(
            "http://localhost:8000/auth/verify",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data) {
            set({
              accessToken,
              refreshToken,
              user: response.data.user,
              isAuthenticated: true,
              error: null,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              accessToken: null,
              refreshToken: null,
              isLoading: false,
              isAuthenticated: false,
            });
          }
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
          });
        }
      },
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

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await useAuthStore.getState().refreshSession();
        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default useAuthStore;
