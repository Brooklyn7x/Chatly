import { apiClient } from "./client";

export const chatApi = {
  getChats: async (): Promise<any> => {
    try {
      const { data } = await apiClient.get("/chats/user-chats");
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch chat ${error}`);
    }
  },

  getChatById: async (chatId: string): Promise<any> => {
    try {
      const { data } = await apiClient.get(`/chats/${chatId}`);
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch chat ${chatId}: ${error}`);
    }
  },

  createChat: async (payload: any) => {
    try {
      const { data } = await apiClient.post("/chats", payload);
      return data;
    } catch (error) {
      throw new Error(`Failed to create chat: ${error}`);
    }
  },

  deleteChat: async (chatId: string) => {
    try {
      await apiClient.delete(`/chats/${chatId}`);
    } catch (error) {
      throw new Error(`Failed to delete chat ${chatId}: ${error}`);
    }
  },
};
