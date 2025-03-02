import { File, X } from "lucide-react";
import Image from "next/image";

interface FilePreviewProps {
  file: File | string;
  onRemove: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

export const FilePreview = ({
  file,
  onRemove,
  isUploading,
  uploadProgress,
}: FilePreviewProps) => {
  const isImage =
    typeof file === "string"
      ? file.match(/\.(jpeg|jpg|gif|png)$/)
      : file.type.startsWith("image");

  return (
    <div className="relative shrink-0">
      {isImage ? (
        <div className="relative">
          {typeof file === "string" ? (
            <Image
              src={file}
              alt="Preview"
              width={96}
              height={96}
              className="rounded-lg object-cover w-24 h-24 border"
            />
          ) : (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="rounded-lg object-cover w-24 h-24 border"
            />
          )}
          {isUploading && <UploadProgressIndicator progress={uploadProgress} />}
        </div>
      ) : (
        <div className="w-24 h-24 rounded-lg border flex items-center justify-center bg-secondary">
          <File className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <RemoveButton onClick={onRemove} />
    </div>
  );
};

const UploadProgressIndicator = ({ progress }: { progress?: number }) => (
  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
    <div className="relative w-12 h-12">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-200 stroke-current"
          strokeWidth="8"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
        />
        <circle
          className="text-primary stroke-current"
          strokeWidth="8"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          strokeDasharray="251.2"
          strokeDashoffset={251.2 - (251.2 * (progress || 0)) / 100}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-white text-xs">
        {Math.round(progress || 0)}%
      </span>
    </div>
  </div>
);

const RemoveButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="absolute top-1 right-1 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
  >
    <X className="h-3 w-3 text-white" />
  </button>
);
