import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Paperclip, Smile } from "lucide-react";
import { useState } from "react";

export default function ChatInput() {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachment] = useState(false);
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t py-4 px-4">
      <div className="sm:max-w-[640px] mx-auto w-full relative">
        <Input
          className="w-full pl-10 pr-10 h-12 sm:h-14"
          placeholder="Type a message..."
        />

        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="absolute left-3 top-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
        >
          <Smile className="h-5 w-5" />
        </button>

        <button
          onClick={() => setShowAttachment(!showAttachments)}
          className="absolute right-3 top-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
        >
          <Paperclip className="h-5 w-5" />
        </button>

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
