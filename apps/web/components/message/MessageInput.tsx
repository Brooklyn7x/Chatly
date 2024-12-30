import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Paperclip, Send, Smile } from "lucide-react";
import { useEffect, useState } from "react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
}

export default function MessageInput({
  onSendMessage,
  onTypingStart,
  onTypingStop,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachment] = useState(false);

  const handleTyping = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    setMessage(content);

    if (!isTyping) {
      setIsTyping(true);
      onTypingStart();
    }

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTimeout = setTimeout(() => {
      setIsTyping(false);
      onTypingStop();
    }, 2000);

    setTypingTimeout(newTimeout);
  };

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      setIsTyping(false);
      onTypingStop();

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);
  return (
    <div className="p-4 bg-background">
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute left-3 top-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
          >
            <Smile className="h-6 w-6" />
          </button>

          <textarea
            className="w-full pl-10 pr-10 py-2 rounded-lg border"
            placeholder="Type a message..."
            onChange={handleTyping}
            value={message}
          />

          <button
            type="button"
            onClick={() => setShowAttachment(!showAttachments)}
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
          >
            <Paperclip className="h-6 w-6" />
          </button>
        </div>

        <button
          type="submit"
          className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center"
        >
          <Send className="h-6 w-6" />
        </button>
      </form>

      {showEmojiPicker && (
        <div
          className={cn(
            "absolute bottom-full mb-2 left-0",
            "transition-all duration-300 ease-in-out transform origin-bottom-left",
            showEmojiPicker
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-50 translate-y-4 pointer-events-none"
          )}
        >
          <div className="border bg-background rounded-md shadow-lg p-4">
            Emoji Picker Content
          </div>
        </div>
      )}

      {showAttachments && (
        <div
          className={cn(
            "absolute bottom-full mb-2 right-0",
            "transition-all duration-300 ease-in-out transform origin-bottom-right",
            showEmojiPicker
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-50 translate-y-4 pointer-events-none"
          )}
        >
          <div className="border bg-background rounded-md shadow-lg p-4">
            Attachment Picker
          </div>
        </div>
      )}
    </div>
  );
}
