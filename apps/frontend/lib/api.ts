import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// export const registerUser = async (userData: {
//   email: string;
//   password: string;
//   username: string;
// }) => {
//   const response = await api.post("/api/auth/register", userData);
//   return response.data;
// };

export const registerUser = async (userData: {
  email: string;
  password: string;
  username: string;
}) => {
  try {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      return {
        success: false,
        error: error.response.data.error || "Invalid request data.",
      };
    } else {
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed. Please try again.",
      };
    } else {
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  }
};

export default api;
