import axios, { AxiosError } from "axios";
import useAuthStore from "@/store/useAuthStore";
import { AuthError, AUTH_ERROR_CODES } from "@/utils/errors";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export const handleAuthError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message;

    switch (status) {
      case 400:
        throw new AuthError(
          message,
          AUTH_ERROR_CODES.INVALID_CREDENTIALS,
          status
        );
      case 401:
        throw new AuthError(
          message,
          AUTH_ERROR_CODES.INVALID_CREDENTIALS,
          status
        );
      case 403:
        throw new AuthError(message, AUTH_ERROR_CODES.TOKEN_EXPIRED, status);
      case 404:
        throw new AuthError(
          "Service not found",
          AUTH_ERROR_CODES.NETWORK_ERROR,
          status
        );
      default:
        throw new AuthError(message, AUTH_ERROR_CODES.UNKNOWN_ERROR, status);
    }
  }
  throw new AuthError(
    "An unexpected error occurred",
    AUTH_ERROR_CODES.UNKNOWN_ERROR
  );
};
