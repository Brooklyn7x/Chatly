import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Paperclip, Send, Smile } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [showAttachments, setShowAttachment] = useState(false);

  const handleTyping = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    setMessage(content);
    onTypingStart();
  };

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="p-4">
      <div className="md:max-w-[700px] mx-auto relative">
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
              className="w-full pl-12 pr-10 py-2 text rounded-lg border"
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
            className="h-14 w-14 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center"
          >
            <Send className="h-7 w-7" />
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
    </div>
  );
}
