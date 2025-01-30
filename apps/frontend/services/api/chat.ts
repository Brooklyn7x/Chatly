import { apiClient } from "./client";

export const chatApi = {
  getChats: async (): Promise<any> => {
    const { data } = await apiClient.get("/chats/user-chats");
    return data;
  },

  getChatById: async (chatId: string): Promise<any> => {
    const { data } = await apiClient.get(`/chats/${chatId}`);
    return data;
  },

  createChat: async (payload: any) => {
    const { data } = await apiClient.post("/chats", payload);
    return data;
  },

  deleteChat: async (chatId: string) => {
    const { data } = await apiClient.delete(`/chats/${chatId}`);
    return data;
  },
};
