import { useCallback, useRef, useState, useMemo, useEffect } from "react";
import { Book, Camera, Paperclip, Send, Smile, X, File } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import { AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/useChatStore";
import { useMessage } from "@/hooks/useMessage";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { UploadDropzone, useUploadThing } from "@/utils/uploathings";
import Image from "next/image";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "sonner";

export default function MessageInput() {
  const { activeChatId } = useChatStore();
  const { accessToken } = useAuthStore();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachment, setShowAttachment] = useState(false);
  const [attachments, setAttachments] = useState<[]>([]);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const attachmentPickerRef = useRef<HTMLDivElement>(null);
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
      sendMessage({ attachments, message });
      setMessage("");
      setAttachments([]);
      setPreviewFiles([]);
    }
  };

  const handleEmojiPicker = useCallback(() => {
    setShowEmojiPicker(!showEmojiPicker);
    setShowAttachment(false);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const acceptedFiles = Array.from(files).filter((file) => {
      const fileType = file.type.split("/")[0];
      return ["image", "video", "pdf"].includes(fileType);
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
          <div className="flex items-center gap-2">
            <div className="relative flex-1 flex gap-2 items-center min-w-0">
              <button
                type="button"
                onClick={handleEmojiPicker}
                className="absolute left-3 hover:scale-105 transition-transform text-muted-foreground hover:text-foreground"
              >
                <Smile className="h-5 w-5" />
              </button>

              <textarea
                ref={textareaRef}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border bg-background resize-none min-h-[40px] max-h-[150px] text-sm ring-0 focus-visible:bg-none focus:outline-none overflow-hidden truncate"
                placeholder="Type a message..."
                onChange={handleTyping}
                value={message}
                rows={1}
                style={{ fontSize: "16px" }}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
                disabled={isUploading}
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,application/pdf"
                className="hidden"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </div>

            <button
              onClick={handleSendMessage}
              className="h-9 w-9 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 text-secondary transition-colors flex-shrink-0 min-w-[36px]"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

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
                <div key={`preview-${index}`} className="relative shrink-0">
                  {file.type.startsWith("image") ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="rounded-lg object-cover w-24 h-24 border"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <div className="relative w-12 h-12">
                            <svg
                              className="w-full h-full"
                              viewBox="0 0 100 100"
                            >
                              <circle
                                className="text-gray-200 stroke-current"
                                strokeWidth="8"
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                              ></circle>
                              <circle
                                className="text-primary stroke-current"
                                strokeWidth="8"
                                strokeLinecap="round"
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                strokeDasharray="251.2"
                                strokeDashoffset={
                                  251.2 - (251.2 * uploadProgress) / 100
                                }
                              ></circle>
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-white text-xs">
                              {Math.round(uploadProgress)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg border flex items-center justify-center bg-secondary">
                      <File className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <button
                    onClick={() =>
                      setPreviewFiles((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="absolute top-1 right-1 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
              <div className="md:hidden">
                {attachments.map((fileUrl, index) => (
                  <div key={`uploaded-${index}`} className="relative shrink-0">
                    {fileUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                      <Image
                        src={fileUrl}
                        alt={`Attachment ${index + 1}`}
                        width={96}
                        height={96}
                        className="rounded-lg object-cover w-24 h-24"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-lg border flex items-center justify-center bg-secondary">
                        <File className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <button
                      onClick={() =>
                        setAttachments((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      className="absolute top-1 right-1 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
