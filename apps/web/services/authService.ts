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

export const loginUser = async (credentials: LoginRequest) => {
  const response = await apiClient.post("/auth/login", credentials);
  return response.data;
};

export const register = async (credentials: RegisterRequest): Promise<any> => {
  const response = await apiClient.post("/auth/register", credentials);
  return response.data;
};

export const logoutUser = async () => {
  await apiClient.post("/auth/logout");
};
