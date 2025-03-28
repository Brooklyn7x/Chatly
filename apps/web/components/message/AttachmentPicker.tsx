import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Book, Camera } from "lucide-react";
import { PreviewModal } from "../modal/PreviewModal";

interface AttachmentPickerProps {
  show: boolean;
  onClose: () => void;
  onAttach: (files: File[]) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export interface FilePreview {
  file: File;
  preview: string;
  type: "image" | "video" | "document";
}

function AttachmentPicker({
  show,
  onClose,
  onAttach,
  containerRef,
}: AttachmentPickerProps) {
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  if (!show) return null;
  const getFileType = (file: File): "image" | "document" | "video" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "document";
  };

  const createFilePreview = useCallback(
    async (file: File): Promise<FilePreview> => {
      const fileType = getFileType(file);
      let preview = "";

      if (fileType === "image") {
        preview = URL.createObjectURL(file);
      } else {
        preview = `/icons/${fileType}-icon.png`;
      }

      return { file, preview, type: fileType };
    },
    [getFileType]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const previews = await Promise.all(files.map(createFilePreview));
      setSelectedFiles((prev) => [...prev, ...previews]);
    },
    [createFilePreview]
  );

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index]) {
        URL.revokeObjectURL(newFiles[index].preview);
        newFiles.splice(index, 1);
      }
      return newFiles;
    });
  }, []);
  const handleSend = useCallback(() => {
    const files = selectedFiles.map((fp) => ({
      file: fp.file,
      type: fp.type,
    }));
    onAttach(files as any);
    selectedFiles.forEach((fp) => URL.revokeObjectURL(fp.preview));
    setSelectedFiles([]);
    setShowPreview(false);
    onClose();
  }, [selectedFiles, onAttach, onClose]);

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "absolute z-50",
          "bg-background rounded-lg shadow-lg",
          "border",
          "transition-all duration-200 ease-in-out",
          "transform origin-bottom-right",
          show
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-50  translate-y-4"
        )}
        style={{
          bottom: "100%",
          right: "60px",
          minWidth: "200px",
        }}
      >
        <div className="p-1">
          <label className="flex items-center gap-4 px-4 py-1.5 text-muted-foreground rounded-lg hover:bg-muted/60 cursor-pointer">
            <Camera className="h-4 w-4" />
            <span className="text-sm">Photo or Video</span>
          </label>

          <label className="flex items-center gap-4 px-4 py-1.5 text-muted-foreground rounded-lg hover:bg-muted/60 cursor-pointer">
            <input
              type="file"
              multiple
              accept=".doc,.docx,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <Book className="h-4 w-4" />
            <span className="text-sm">Documents</span>
          </label>
        </div>
      </div>

      {selectedFiles && selectedFiles.length > 0 && (
        <PreviewModal
          files={selectedFiles}
          onClose={() => {
            setSelectedFiles([]);
            setShowPreview(false);
          }}
          onRemove={removeFile}
          onSend={handleSend}
        />
      )}
    </>
  );
}

export default AttachmentPicker;
