import apiClient from "./apiClient";

interface UpdateData {
  username: string;
  email: string;
}

export const me = async () => {
  const response = await apiClient.get("/user/me");
  return response;
};

export const updateProfile = async (data: UpdateData) => {
  const response = await apiClient.post("/user/profile", data);
  return response;
};

export const getContacts = async () => {
  const response = await apiClient.get("/user/contact");
  return response;
};

export const addContact = async (id: string) => {
  const data = { id };
  const response = await apiClient.post("/user/contact", data);
  return response;
};

export const searchUsers = async (query: string) => {
  const response = await apiClient.get(`/user/search?search=${query}`);
  return response;
};
