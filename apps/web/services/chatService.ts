import { apiClient } from "./apiClient";

interface createChatData {
  type: string;
  participants: { userId: string }[];
  name?: string;
  description?: string;
}

interface addParticipantsData {
  conversationId: string;
  participants: string[];
}
interface removePartcipantsData {
  conversationId: string;
  userId: string;
}

interface updateChatData {
  name?: string;
  description?: string;
}

export const getAllChats = async () => {
  const response = await apiClient.get("/conversations");
  return response.data;
};

export const createChat = async (data: createChatData) => {
  console.log(data);
  const response = await apiClient.post("/conversations", data);
  return response.data;
};

export const updateChat = async (data: updateChatData) => {
  const response = await apiClient.post("/conversations/participants", data);
  return response.data;
};

export const addParticipants = async (data: addParticipantsData) => {
  const response = await apiClient.put("/conversations/participants", data);
  return response.data;
};

export const removePartcipants = async (data: removePartcipantsData) => {
  const response = await apiClient.delete("/conversations/participants", {
    data,
  });
  return response.data;
};

export const deleteChat = async (conversationId: string) => {
  const response = await apiClient.delete(`/conversations/${conversationId}`);
  return response.data;
};
