import { useCallback, useEffect, useRef, useState } from "react";
import { Paperclip, SendHorizonal, Smile } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import AttachmentPicker from "./AttachmentPicker";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onTypingStart: () => void;
  onFileUpload: (file: File[]) => void;
}

export default function MessageInput({
  onSendMessage,
  onTypingStart,
  onFileUpload,
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

  const handleAttach = (files: any) => {
    onFileUpload(files);
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
    <div className="bottom-0 left-0 right-0">
      <div className="relative max-w-2xl mx-auto px-4 pb-3">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <button
              type="button"
              onClick={handleEmojiPicker}
              className="absolute left-4 hover:scale-110 transition-transform text-muted-foreground hover:text-foreground"
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
              className="absolute right-4 hover:scale-110 transition-transform text-muted-foreground hover:text-foreground"
            >
              <Paperclip className="h-6 w-6" />
            </button>
          </div>

          <button
            type="submit"
            className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors flex-shrink-0"
            aria-label="Send message"
          >
            <SendHorizonal className="h-5 w-5" />
          </button>
        </form>

        {showEmojiPicker && (
          <EmojiPicker
            show={showEmojiPicker}
            onClose={() => setShowEmojiPicker(false)}
            onEmojiSelect={handleEmojiSelect}
            containerRef={emojiPickerRef}
          />
        )}

        {setShowAttachment && (
          <AttachmentPicker
            show={showAttachment}
            onClose={() => setShowAttachment(false)}
            onAttach={handleAttach}
            containerRef={attachmentPickerRef}
          />
        )}
      </div>
    </div>
  );
}
