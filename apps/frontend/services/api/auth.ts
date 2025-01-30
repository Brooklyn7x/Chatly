import { LoginInput, RegisterInput } from "@/types/auth";
import { apiClient } from "./client";
import { verify } from "crypto";

export const authApi = {
  login: async (data: LoginInput) => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },
  register: async (data: RegisterInput) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },
  refreshToken: async () => {
    const response = await apiClient.post("/auth/refresh");
    return response.data;
  },

  verify: async (data: { token: string }) => {
    const response = await apiClient.post("/auth/verify", data);
    return response.data;
  },
  logout: async () => {
    await apiClient.post("/auth/logout");
  },
};
