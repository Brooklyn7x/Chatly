import { handleApiError } from "@/lib/error";
import { apiClient } from "./client";

export const UserApi = {
  searchUsers: async (query: string) => {
    try {
      const { data } = await apiClient.get("/user/search", {
        params: { query },
      });
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateUserData: async (updateData: {
    name?: string;
    username?: string;
    profilePicture?: string;
    password?: string;
  }) => {
    try {
      const { data } = await apiClient.put("/user/profile", updateData);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },
};
