import { useState } from "react";
import { FileApi } from "@/services/api/file";

export function useFileUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const uploadFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await FileApi.uplodFile(formData);
      setIsSuccess(true);
      return response;
    } catch (err) {
      setError("File upload failed. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getFile = async (fileId: string) => {
    // ... similar loading/error handling for get operation ...
  };

  const deleteFile = async (fileId: string) => {
    // ... similar loading/error handling for delete operation ...
  };

  return {
    uploadFile,
    getFile,
    deleteFile,
    isLoading,
    error,
    isSuccess,
  };
}
