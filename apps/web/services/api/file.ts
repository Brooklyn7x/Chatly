import { handleApiError } from "@/lib/error";
import { apiClient } from "./client";

export const FileApi = {
  uplodFile: async (file: any) => {
    try {
      const { data } = await apiClient.post("/upload", file);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },
  getFile: async (fileId: string) => {
    try {
      const { data } = await apiClient.get(`/upload/${fileId}`);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },
  deleteFile: async (fileId: string) => {
    try {
      const { data } = await apiClient.delete(`/upload/${fileId}`);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },
};
