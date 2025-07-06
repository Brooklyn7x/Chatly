import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Smile } from "lucide-react";
import useChat from "@/hooks/useChat";
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
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Only use useChat - clean and simple!
  const { 
    sendMessage, 
    startTyping, 
    stopTyping, 
    isConnected, 
    activeChatId 
  } = useChat();

  useEffect(() => {
    import("@emoji-mart/data").then((mod) => {
      setEmojiData(mod.default || mod);
    });
  }, []);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const content = e.target.value;
    setMessage(content);

    if (!activeChatId || !isConnected) return;

    // Start typing indicator
    startTyping(activeChatId);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of no activity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(activeChatId);
    }, 2000);
  };

  const handleSendMessage = () => {
    // DETAILED DEBUGGING
    console.log("📤 ChatInput: handleSendMessage called");
    console.log("  - message:", JSON.stringify(message));
    console.log("  - message.trim():", JSON.stringify(message?.trim()));
    console.log("  - activeChatId:", activeChatId);
    console.log("  - isConnected:", isConnected);

    if (!message) {
      console.warn("⚠️ ChatInput: No message");
      return;
    }

    if (!message.trim()) {
      console.warn("⚠️ ChatInput: Message is empty after trim");
      return;
    }

    if (!activeChatId) {
      console.warn("⚠️ ChatInput: No active chat ID");
      return;
    }

    if (!isConnected) {
      console.warn("⚠️ ChatInput: Not connected");
      return;
    }

    console.log("✅ ChatInput: All checks passed, calling sendMessage");
    
    // Send message through useChat
    sendMessage(activeChatId, message);
    
    // Clear input and stop typing
    setMessage("");
    stopTyping(activeChatId);
    
    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const newMessage =
        message.substring(0, start) +
        emoji.native +
        message.substring(end);
      setMessage(newMessage);
      
      // Focus and set cursor position after emoji
      setTimeout(() => {
        textarea.focus();
        const newPosition = start + emoji.native.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };

  // Cleanup typing timeout on unmount or when chat changes
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (activeChatId && isConnected) {
        stopTyping(activeChatId);
      }
    };
  }, [activeChatId, isConnected, stopTyping]);

  // Show different states based on connection
  const getPlaceholder = () => {
    if (!isConnected) return "Connecting...";
    if (!activeChatId) return "Select a chat to start messaging";
    return "Type a message...";
  };

  const isDisabled = !isConnected || !activeChatId;

  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-2">
        {/* Emoji Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <button 
              className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
              disabled={isDisabled}
            >
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
                onEmojiSelect={handleEmojiSelect}
                navPosition="top"
                previewPosition="none"
                skinTonePosition="none"
                searchPosition="sticky"
                emojiSize={24}
              />
            )}
          </PopoverContent>
        </Popover>

        {/* Message Input */}
        <Input
          ref={textareaRef}
          value={message}
          onKeyDown={handleKeyPress}
          onChange={handleTyping}
          placeholder={getPlaceholder()}
          className="border pl-4 bg-input border-input flex-1"
          disabled={isDisabled}
        />

        {/* Send Button */}
        <Button
          onClick={handleSendMessage}
          disabled={!message?.trim() || isDisabled}
          size="icon"
          className="rounded-full"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Enhanced Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-muted-foreground mt-2 space-y-1">
          <div className="flex items-center gap-2">
            <span>Connected: {isConnected ? '✅' : '❌'}</span>
            <span>Chat: {activeChatId ? `✅ ${activeChatId.slice(-6)}` : '❌ None'}</span>
            <span>Message: {message ? `"${message.slice(0, 20)}${message.length > 20 ? '...' : ''}"` : '❌ Empty'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Can Send: {(!message?.trim() || isDisabled) ? '❌' : '✅'}</span>
            <span>Disabled: {isDisabled ? '✅' : '❌'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
