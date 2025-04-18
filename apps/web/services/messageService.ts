import apiClient from "./apiClient";
export const getMessages = async (
  chatId: string,
  cursor: string | null = null,
  limit: number = 20
) => {
  const params: Record<string, any> = { limit };
  if (cursor) {
    params.cursor = cursor;
  }
  const response = await apiClient.get(`/messages/${chatId}`, { params });
  return response.data;
};
