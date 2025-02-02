import { LoginInput, RegisterInput } from "@/types/auth";
import { apiClient } from "./client";
import { AuthError, AUTH_ERROR_CODES } from "@/utils/errors";
import { AxiosError } from "axios";

const handleAuthError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    switch (status) {
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

export const authApi = {
  login: async (data: LoginInput) => {
    try {
      const response = await apiClient.post("/auth/login", data);
      // apiClient.defaults.headers.common["Authorization"] =
      //   `Bearer ${response.data.accessToken}`;
      return response.data;
    } catch (error) {
      throw handleAuthError(error);
    }
  },
  register: async (data: RegisterInput) => {
    try {
      const response = await apiClient.post("/auth/register", data);
      return response.data;
    } catch (error) {
      throw handleAuthError(error);
    }
  },
  refreshToken: async () => {
    try {
      const response = await apiClient.post("/auth/refresh");
      return response.data;
    } catch (error) {
      throw handleAuthError(error);
    }
  },

  verify: async (accessToken: string) => {
    try {
      const response = await apiClient.get("/auth/verify", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw handleAuthError(error);
    }
  },
  logout: async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      throw handleAuthError(error);
    }
  },
};
