import axios from "axios";
import { handleError } from "@/lib/error";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh") &&
      !originalRequest.url.includes("/login") &&
      !originalRequest.url.includes("/register")
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => {
            handleError(err, "Request failed");
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post("/auth/refresh");
        processQueue(null);
        isRefreshing = false;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        handleError(refreshError, "Session expired, please login again");
     
        if (
          !window.location.pathname.startsWith("/login") &&
          !window.location.pathname.startsWith("/signup")
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    handleError(error);
    return Promise.reject(error);
  }
);

export default apiClient;
