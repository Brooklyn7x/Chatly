import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import useAuthStore from "@/store/useAuthStore";
import { AuthError, AUTH_ERROR_CODES } from "@/utils/errors";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// apiClient.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config;

//     const originalRequestWithRetry = originalRequest as AxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     if (error.response?.status === 401 && !originalRequestWithRetry._retry) {
//       originalRequestWithRetry._retry = true;

//       try {
//         const refreshToken = useAuthStore.getState().accessToken;
//         const response = await axios.post(
//           `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
//           { refreshToken }
//         );

//         const { accessToken } = response.data;
//         useAuthStore.getState().setToken(accessToken);

//         if (originalRequest?.headers) {
//           originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//         }
//         if (!originalRequest) {
//           return Promise.reject(new Error("Original request is undefined"));
//         }
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         useAuthStore.getState().logout();
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );
