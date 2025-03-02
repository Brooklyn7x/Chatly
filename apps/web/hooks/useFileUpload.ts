import { useUploadThing } from "@/utils/uploathings";
import { useState } from "react";

interface UseFileUploadOptions {
  endpoint: "profilePicture" | "attachments";
  accessToken: string;
}

interface UploadResult {
  url: string;
}

export const useFileUpload = (options: UseFileUploadOptions) => {
  const { endpoint, accessToken } = options;
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { startUpload } = useUploadThing(endpoint, {
    headers: { authorization: `Bearer ${accessToken}` },
    onClientUploadComplete: (res) => {
      setIsUploading(false);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
    onUploadError: (error) => {
      setError("Failed to upload files");
      setIsUploading(false);
    },
  });

  const fileUpload = async (files: File[]) => {
    if (!files || files.length === 0) {
      setError("No files selected");
      return null;
    }
    setIsUploading(true);
    setError(null);

    try {
      const result = await startUpload(files);
      if (result) {
        return result.map((file) => ({
          url: file.url,
        })) as UploadResult[];
      }
      return null;
    } catch (error) {
      setError("Failed to upload files");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    fileUpload,
    uploadProgress,
    isUploading,
    error,
  };
};
