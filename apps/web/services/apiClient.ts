import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

// Variable to hold the token refresh promise
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

    // Bypass error handling for the refresh endpoint itself
    if (!originalRequest) {
      return Promise.reject(error);
    }
    if (
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    // If a 401 status and haven't already retried
    if (error.response?.status === 401 && !originalRequestWithRetry._retry) {
      originalRequestWithRetry._retry = true;

      try {
        // Use a single token refresh promise if one is already in flight
        if (!refreshingToken) {
          refreshingToken = axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );
        }

        await refreshingToken;
        // Once done, reset the refreshing token
        refreshingToken = null;

        if (!originalRequest) {
          return Promise.reject(new Error("Original request is undefined"));
        }
        // Retry the original request with the new token information.
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Clear the refresh token so subsequent calls can try again
        refreshingToken = null;

        // Token refresh has failed; redirect to login.
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
