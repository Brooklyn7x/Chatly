import { useCallback, useEffect, useRef, useState } from "react";
import { Paperclip, Send, SendHorizonal, Smile } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import AttachmentPicker from "./AttachmentPicker";
import { AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/useChatStore";
import { useMessage } from "@/hooks/useMessage";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Textarea } from "../ui/textarea";

export default function MessageInput() {
  const { activeChatId } = useChatStore();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachment, setShowAttachment] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const attachmentPickerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage } = useMessage(activeChatId || "");
  const { handleTypingStart } = useTypingIndicator(activeChatId || "");
  const { uploadFile, isLoading: isUploading } = useFileUpload();

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

  const handleAttach = async (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    const uploadPromises = imageFiles.map((file) => uploadFile(file));
    const uploadedImages = await Promise.all(uploadPromises);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  const handleEmojiPicker = useCallback(() => {
    setShowEmojiPicker(!showEmojiPicker);
    setShowAttachment(false);
  }, []);

  const handleAttachmentPicker = useCallback(() => {
    setShowAttachment(!showAttachment);
    setShowEmojiPicker(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
      if (
        showAttachment &&
        attachmentPickerRef.current &&
        !attachmentPickerRef.current.contains(event.target as Node)
      ) {
        setShowAttachment(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker, showAttachment]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm">
      <div className="relative max-w-2xl mx-auto px-4 pb-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center min-w-0">
            <button
              type="button"
              onClick={handleEmojiPicker}
              className="absolute left-3 hover:scale-105 transition-transform text-muted-foreground hover:text-foreground"
            >
              <Smile className="h-5 w-5" />
            </button>

            <textarea
              ref={textareaRef}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border bg-background resize-none min-h-[40px] max-h-[150px] text-sm ring-0 focus-visible:bg-none focus:outline-none overflow-hidden"
              placeholder="Type a message..."
              onChange={handleTyping}
              value={message}
              rows={1}
              style={{ fontSize: "16px" }}
            />

            <button
              type="button"
              onClick={handleAttachmentPicker}
              className="absolute right-3 hover:scale-105 transition-transform text-muted-foreground hover:text-foreground"
            >
              <Paperclip className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            className="h-9 w-9 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 text-secondary transition-colors flex-shrink-0 min-w-[36px]"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
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

        <AttachmentPicker
          show={showAttachment}
          onClose={() => setShowAttachment(false)}
          onAttach={(files) => {
            setAttachments((prev) => [...prev, ...Array.from(files)]);
            setShowAttachment(false);
          }}
          containerRef={attachmentPickerRef}
        />
      </div>
    </div>
  );
}
