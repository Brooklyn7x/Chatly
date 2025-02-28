import { handleApiError } from "@/lib/error";
import { apiClient } from "./apiClient";

export const MessageApi = {
  getMessages: async (chatId: string): Promise<any> => {
    try {
      const { data } = await apiClient.get(`/messages/${chatId}`);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

  sendMessage: async (payload: any) => {
    try {
      const { data } = await apiClient.post(`/messages`, payload);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteMessage: async (messageId: string) => {
    try {
      const { data } = await apiClient.delete(`/messages/${messageId}`);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateMessage: async (messageId: string) => {
    try {
      const { data } = await apiClient.put(`/messages/${messageId}`);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },
};
