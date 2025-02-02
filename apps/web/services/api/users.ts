import { apiClient } from "./client";

export const UserApi = {
  searchUsers: async (query: string) => {
    const { data } = await apiClient.get("/users/search", {
      params: { query },
    });
    return data;
  },
};
