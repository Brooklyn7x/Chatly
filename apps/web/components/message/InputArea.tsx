import { Paperclip, Send, Smile } from "lucide-react";
import { ChangeEvent, RefObject } from "react";
import data from "@emoji-mart/data";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EmojiPicker from "@emoji-mart/react";

interface InputAreaProps {
  message: string;
  textareaRef: RefObject<HTMLTextAreaElement>;
  isUploading: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  handleTyping: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleEmojiSelect: (emoji: string) => void;
  handleFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
}

export const InputArea = ({
  handleTyping,
  message,
  textareaRef,
  isUploading,
  fileInputRef,
  handleEmojiSelect,
  handleFileSelect,
  handleSendMessage,
}: InputAreaProps) => (
  <>
    <div className="flex items-center gap-2">
      <div className="relative flex-1 flex items-center gap-2 min-w-0 border px-2 rounded-md">
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
              <Smile className="h-5 w-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-full p-0 shadow-md rounded-md mb-1"
            align="start"
            side="top"
          >
            <EmojiPicker
              data={data}
              onEmojiSelect={(emoji: any) => {
                handleEmojiSelect(emoji.native);
              }}
              navPosition="top"
              previewPosition="none"
              skinTonePosition="none"
              searchPosition="sticky"
            />
          </PopoverContent>
        </Popover>

        <textarea
          ref={textareaRef}
          className="w-full  py-2.5 rounded-xl bg-background resize-none min-h-[40px] max-h-[150px] text-sm ring-0 focus-visible:bg-none focus:outline-none overflow-hidden truncate"
          placeholder="Type a message..."
          onChange={handleTyping}
          value={message}
          rows={1}
          style={{ fontSize: "16px" }}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
              disabled={isUploading}
            >
              <Paperclip className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mb-1 w-36 p-2">
            <DropdownMenuItem>Documets</DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              Photos & Videos
            </DropdownMenuItem>
            <DropdownMenuItem>Camera</DropdownMenuItem>
            <DropdownMenuItem>Contact</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
  </>
);
