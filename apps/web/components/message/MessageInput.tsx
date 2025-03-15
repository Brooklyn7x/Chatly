import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

import { useChatStore } from "@/store/useChatStore";
import { useMessage } from "@/hooks/useMessage";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { useUploadThing } from "@/utils/uploathings";
import useAuthStore from "@/store/useAuthStore";

import { InputArea } from "./InputArea";

const EmojiPicker = dynamic(() => import("./EmojiPicker"));
const FilePreview = dynamic(() => import("./FilePreview"));

export default function MessageInput() {
  const { activeChatId } = useChatStore();
  const { accessToken } = useAuthStore();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachment, setShowAttachment] = useState(false);
  const [attachments, setAttachments] = useState<(File | string)[]>([]);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage } = useMessage(activeChatId || "");
  const { handleTypingStart } = useTypingIndicator(activeChatId || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [totalFilesUploading, setTotalFilesUploading] = useState(0);

  const { isUploading, startUpload } = useUploadThing("attachments", {
    onClientUploadComplete: (res) => {
      const files = res.map((file) => file.url);
      setAttachments((prev) => [...prev, ...files]);
      setPreviewFiles([]);
      setUploadProgress(0);
      setTotalFilesUploading(0);
      toast.success("Files uploaded successfully");
    },
    onUploadError: (error: Error) => {
      toast.error(error.message);
      setUploadProgress(0);
      setTotalFilesUploading(0);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  const handleTyping = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    setMessage(content);
    handleTypingStart();
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
      sendMessage({
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

  const handleEmojiPicker = useCallback(() => {
    setShowEmojiPicker((prev) => !prev);
    setShowAttachment(false);
  }, [showEmojiPicker]);

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

    setTotalFilesUploading(acceptedFiles.length);
    setPreviewFiles(acceptedFiles);
    try {
      await startUpload(acceptedFiles);
    } catch (error) {
      toast.error("Failed to upload files");
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm">
        <div className="relative max-w-2xl mx-auto px-4 pb-3 pt-2">
          <InputArea
            handleEmojiPicker={handleEmojiPicker}
            handleTyping={handleTyping}
            message={message}
            textareaRef={textareaRef}
            isUploading={isUploading}
            fileInputRef={fileInputRef}
            handleFileSelect={handleFileSelect}
            handleSendMessage={handleSendMessage}
          />

          <AnimatePresence>
            {showEmojiPicker && (
              <EmojiPicker
                show={showEmojiPicker}
                onClose={() => setShowEmojiPicker(false)}
                onEmojiSelect={handleEmojiSelect}
                containerRef={emojiPickerRef}
              />
            )}
          </AnimatePresence>
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
                  uploadProgress={uploadProgress}
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
