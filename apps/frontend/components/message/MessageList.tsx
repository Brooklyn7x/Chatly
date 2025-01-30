import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Message } from "@/store/useMessageStore";
import { Avatar } from "@radix-ui/react-avatar";
import { MessageContent } from "./MessageContent";
import { MessageStatus } from "./MessageStatus";
import { useEffect, useRef, useState } from "react";
import { ArrowDownIcon } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const currentUser = useAuthStore((state) => state.user);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, scrollTop, clientHeight } =
          scrollContainerRef.current;
        const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setIsNearBottom(nearBottom);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div ref={scrollContainerRef} className="flex-1 p-4 overflow-y-scroll">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            isOwn={message.senderId === currentUser?._id}
          />
        ))}
      </div>
      {!isNearBottom && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-4 right-4 p-2 bg-black rounded-full border bg-primary"
        >
          <ArrowDownIcon className="h-6 w-6" />
        </button>
      )}
      <div ref={messageEndRef} />
    </div>
  );
}
interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}
const MessageBubble = ({ isOwn, message }: MessageBubbleProps) => {
  return (
    <div
      key={message._id}
      className={`flex items-center gap-2 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {!isOwn && (
        <Avatar className="h-10 w-10">
          <AvatarImage src={`/avatars/${message.senderId}.png`} />
          <AvatarFallback>SN</AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
        {!isOwn && (
          <span className="text-xs text-muted-foreground mb-1">
            {message.senderId}
          </span>
        )}
        <div
          className={cn(
            "max-w-md border rounded-lg p-2",
            isOwn && "bg-blue-500"
          )}
        >
          <MessageContent content={message.content} type={message.type} />

          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-xs opacity-70">
              {new Date(message.timestamp || new Date()).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </span>
            {isOwn && <MessageStatus status={message.status} />}
          </div>
        </div>
      </div>
    </div>
  );
};
