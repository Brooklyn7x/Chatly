import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Paperclip, SendHorizonal, Smile } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import AttachmentPicker from "./AttachmentPicker";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onTypingStart: () => void;
}

export default function MessageInput({
  onSendMessage,
  onTypingStart,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachment, setShowAttachment] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const attachmentPickerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTyping = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    setMessage(content);
    onTypingStart();
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

  const handleAttach = (files: File[]) => {
    console.log(files, "files Attachment");
  };

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      setShowEmojiPicker(false);
      setShowAttachment(false);
    }
  };

  const handleEmojiPicker = useCallback(() => {
    setShowEmojiPicker((prev) => !prev);
    setShowAttachment(false);
  }, []);

  const handleAttachmentPicker = useCallback(() => {
    setShowAttachment((prev) => !prev);
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
    <div className="bottom-0 left-0 right-0">
      <div className="relative max-w-3xl mx-auto px-4 py-3">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="relative flex-1">
            <button
              type="button"
              onClick={handleEmojiPicker}
              className="absolute left-3 bottom-5 hover:scale-110 transition-transform text-muted-foreground hover:text-foreground"
            >
              <Smile className="h-6 w-6" />
            </button>

            <textarea
              ref={textareaRef}
              className="w-full pl-12 pr-12 py-3 rounded-2xl resize-none min-h-[50px] max-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
              onChange={handleTyping}
              value={message}
              rows={1}
            />

            <button
              type="button"
              onClick={handleAttachmentPicker}
              className="absolute right-3 bottom-5 hover:scale-110 transition-transform text-muted-foreground hover:text-foreground"
            >
              <Paperclip className="h-6 w-6" />
            </button>
          </div>

          <button
            type="submit"
            className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors flex-shrink-0"
            aria-label="Send message"
          >
            <SendHorizonal className="h-5 w-5" />
          </button>
        </form>

        <EmojiPicker
          show={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onEmojiSelect={handleEmojiSelect}
          containerRef={emojiPickerRef}
        />

        <AttachmentPicker
          show={showAttachment}
          onClose={() => setShowAttachment(false)}
          onAttach={handleAttach}
          containerRef={attachmentPickerRef}
        />
      </div>
    </div>
  );
}
