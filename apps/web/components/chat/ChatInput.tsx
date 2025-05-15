import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMessage } from "@/hooks/message/useMessage";
import { useChatStore } from "@/store/useChatStore";
import { Send, Smile } from "lucide-react";
import { useTyping } from "@/hooks/message/useTyping";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const EmojiPicker = dynamic(() => import("@emoji-mart/react"), {
  ssr: false,
});

const ChatInput = () => {
  const [message, setMessage] = useState<string>("");
  const textareaRef = useRef<HTMLInputElement>(null);
  const [emojiData, setEmojiData] = useState<any>(null);

  const activeChatId = useChatStore((state) => state.activeChatId);

  const { sendMessage } = useMessage();
  const { startTyping } = useTyping(activeChatId || "");

  useEffect(() => {
    import("@emoji-mart/data").then((mod) => {
      setEmojiData(mod.default || mod);
    });
  }, []);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTyping();
    const content = e.target.value;
    setMessage(content);
  };

  const handleSendMessage = () => {
    if (message?.trim()) {
      sendMessage(activeChatId || "", {
        attachments: [],
        message,
      });
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSend = (emoji: any) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd ?? 0;
      const newMessage =
        message.substring(0, start ?? 0) +
        emoji.native +
        message.substring(end);
      setMessage(newMessage);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          (start ?? 0) + emoji.native.length;
        textarea.focus();
      }, 0);
    }
  };

  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-2">
        {/* <Button variant="ghost" size="icon" className="rounded-full">
          <Paperclip className="text-muted-foreground" size={16} />
        </Button> */}

        <Popover>
          <PopoverTrigger asChild>
            <button className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
              <Smile className="h-5 w-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-full p-0 shadow-md rounded-md mb-2"
            align="start"
            side="top"
          >
            {emojiData && (
              <EmojiPicker
                data={emojiData}
                onEmojiSelect={(emoji: any) => {
                  handleEmojiSend(emoji);
                }}
                navPosition="top"
                previewPosition="none"
                skinTonePosition="none"
                searchPosition="sticky"
                emojiSize={24}
              />
            )}
          </PopoverContent>
        </Popover>

        <Input
          ref={textareaRef}
          value={message}
          onKeyDown={handleKeyPress}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="border pl-4 bg-input border-input flex-1"
        />

        <Button
          onClick={handleSendMessage}
          variant="outline"
          size="icon"
          className="rounded-full h-9 w-9 bg-card/90 border"
        >
          <Send className="text-muted-foreground" size={15} />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
