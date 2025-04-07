import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { InputArea } from "../message/InputArea";
import { useChatStore } from "@/store/useChatStore";
import { useTyping } from "@/hooks/message/useTyping";
import { useMessage } from "@/hooks/message/useMessage";
import { useAuth } from "@/hooks/auth/useAuth";

const FilePreview = dynamic(() => import("../message/FilePreview"), {
  ssr: false,
});

export default function ChatInput() {
  const { user } = useAuth();
  const { activeChatId } = useChatStore();
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<(File | string)[]>([]);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage } = useMessage();
  const { startTyping } = useTyping(activeChatId || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [totalFilesUploading] = useState(0);

  const handleTyping = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    startTyping();
    const content = event.target.value;
    setMessage(content);
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage =
        message.substring(0, start) + emoji + message.substring(end);
      setMessage(newMessage);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() || attachments.length > 0) {
      if (!user?._id) return;

      sendMessage(activeChatId || "", user._id, {
        attachments: attachments.map((attachment) =>
          typeof attachment === "string" ? attachment : attachment.name
        ),
        message,
      });
      setMessage("");
      setAttachments([]);
      setPreviewFiles([]);
    }
  };

  const isUploading = false;
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const acceptedFiles = Array.from(files).filter((file) => {
      const fileType = file.type ? file.type.split("/")[0] : "";
      return ["image", "video", "pdf"].includes(fileType || "");
    });

    if (acceptedFiles.length === 0) {
      toast.error("Only images, videos, and PDFs are allowed");
      return;
    }

    try {
    } catch (error) {
      toast.error("Failed to upload files");
    }
  };

  if (!activeChatId) return;
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm">
        <div className="relative max-w-2xl mx-auto px-4 pb-3 pt-2">
          <InputArea
            message={message}
            textareaRef={textareaRef}
            isUploading={false}
            fileInputRef={fileInputRef}
            handleEmojiSelect={handleEmojiSelect}
            handleTyping={handleTyping}
            handleFileSelect={handleFileSelect}
            handleSendMessage={handleSendMessage}
          />
        </div>
      </div>
      {(isUploading || previewFiles.length > 0 || attachments.length > 0) && (
        <div className="fixed bottom-16 left-0 right-0 bg-background/95 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto px-4 py-2">
            {isUploading && (
              <div className="text-sm text-muted-foreground mb-2">
                Uploading {totalFilesUploading} file
                {totalFilesUploading > 1 ? "s" : ""}...
              </div>
            )}
            <div className="flex gap-2 overflow-x-auto">
              {previewFiles.map((file, index) => (
                <FilePreview
                  key={`preview-${index}`}
                  file={file}
                  onRemove={() =>
                    setPreviewFiles((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  isUploading={isUploading}
                  uploadProgress={0}
                />
              ))}
              {attachments.map((fileUrl, index) => (
                <FilePreview
                  key={`uploaded-${index}`}
                  file={fileUrl}
                  onRemove={() =>
                    setAttachments((prev) => prev.filter((_, i) => i !== index))
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
