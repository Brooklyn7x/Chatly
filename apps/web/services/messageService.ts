import { apiClient } from "./apiClient";

export const getMessages = async (chatId: string) => {
  const response = await apiClient.get(`/messages/${chatId}`);
  return response;
};
