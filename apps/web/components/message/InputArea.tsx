import { Paperclip, Send, Smile } from "lucide-react";
import { ChangeEvent, RefObject } from "react";

interface InputAreaProps {
  handleEmojiPicker: () => void;
  handleTyping: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  message: string;
  textareaRef: RefObject<HTMLTextAreaElement>;
  isUploading: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
}

export const InputArea = ({
  handleEmojiPicker,
  handleTyping,
  message,
  textareaRef,
  isUploading,
  fileInputRef,
  handleFileSelect,
  handleSendMessage,
}: InputAreaProps) => (
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
);
