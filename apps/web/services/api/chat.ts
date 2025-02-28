import { handleApiError } from "@/lib/error";
import { apiClient } from "./apiClient";
import { ChatUpdatePayload } from "@/types/chat";

export const chatApi = {
  getChats: async (): Promise<any> => {
    try {
      const { data } = await apiClient.get("/chats");
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getChatById: async (chatId: string): Promise<any> => {
    try {
      const { data } = await apiClient.get(`/chats/${chatId}`);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createChat: async (payload: any) => {
    try {
      const { data } = await apiClient.post("/chats", payload);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteChat: async (chatId: string) => {
    try {
      await apiClient.delete(`/chats/${chatId}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  updateChat: async (
    chatId: string,
    payload: ChatUpdatePayload
  ): Promise<any> => {
    try {
      const { data } = await apiClient.put(`/chats/${chatId}`, payload);
      return data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};
