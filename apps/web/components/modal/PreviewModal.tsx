import { X, EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FilePreview } from "../message/AttachmentPicker";
import Image from "next/image";

interface PreviewModalProps {
  files: FilePreview[];
  onClose: () => void;
  onRemove: (index: number) => void;
  onSend: () => void;
}
export const PreviewModal = ({
  files,
  onClose,
  onRemove,
  onSend,
}: PreviewModalProps) => {
  const [caption, setCaption] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-neutral-900 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-neutral-400" />
          </button>
          <h2 className="text-lg font-medium text-white">Selected Files</h2>
          <button className="p-1.5 hover:bg-neutral-800 rounded-full transition-colors">
            <EllipsisVertical className="h-5 w-5 text-neutral-400" />
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                {file.type === "image" ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={file.preview}
                      alt={file.file.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-sm text-white truncate">
                        {file.file.name}
                      </p>
                    </div>

                    <button
                      onClick={() => onRemove(index)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="relative flex items-center gap-3 p-4 bg-neutral-800 rounded-lg">
                    <div className="flex items-center justify-center h-12 w-12 bg-neutral-700 rounded-lg">
                      {file.type === "video" ? "🎥" : "📄"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {(file.file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => onRemove(index)}
                      className="p-1.5 rounded-full hover:bg-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-neutral-400" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4 p-2 bg-neutral-800 rounded-lg">
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption..."
              className="bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-neutral-500"
            />
            <Button
              onClick={() => {
                onSend();
                setCaption("");
                onClose();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-lg transition-colors"
            >
              Send
            </Button>
          </div>
        </div>

        
      </div>
    </div>
  );
};
