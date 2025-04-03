import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

let refreshingToken: Promise<any> | null = null;

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const originalRequestWithRetry = originalRequest as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }
    if (
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequestWithRetry._retry) {
      originalRequestWithRetry._retry = true;

      try {
        if (!refreshingToken) {
          refreshingToken = axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );
        }

        await refreshingToken;

        refreshingToken = null;

        if (!originalRequest) {
          return Promise.reject(new Error("Original request is undefined"));
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        refreshingToken = null;

        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
