import { handleApiError } from "@/lib/error";
import { apiClient } from "./client";

export const UserApi = {
  searchUsers: async (query: string) => {
    try {
      const { data } = await apiClient.get("/users/search", {
        params: { query },
      });
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },
};
