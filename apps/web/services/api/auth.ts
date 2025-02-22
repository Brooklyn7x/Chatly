import { LoginInput, RegisterInput } from "@/types/auth";
import { apiClient, handleAuthError } from "./client";

export const authApi = {
  login: async (data: LoginInput) => {
    try {
      const response = await apiClient.post("/auth/login", data);
      return response.data;
    } catch (error) {
      console.log(error);
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
      console.log(error, "errormessage");
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
