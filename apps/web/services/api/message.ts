import { apiClient } from "./client";

export const MessageApi = {
  getMessages: async (chatId: string): Promise<any> => {
    const { data } = await apiClient.get(`/messages/${chatId}`);
    return data;
  },

  sendMessage: async (payload: any) => {
    const { data } = await apiClient.post(`/messages`, payload);
    return data;
  },

  deleteMessage: async (messageId: string) => {
    const { data } = await apiClient.delete(`/messages/${messageId}`);
    return data;
  },
};
