import { User } from "@/types";
import { apiClient } from "./apiClient";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  data: User;
}
export const loginUser = async (
  credentials: LoginRequest
): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/login", credentials);
  return response.data;
};

export const register = async (
  credentials: RegisterRequest
): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/register", credentials);
  return response.data;
};
export const logout = async () => {
  await apiClient.post("/auth/logout");
};

export const refreshToken = () => {};
export const validateToken = () => {};
