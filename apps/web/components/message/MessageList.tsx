import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Message } from "@/store/useMessageStore";
import { Avatar } from "@radix-ui/react-avatar";
import { MessageContent } from "./MessageContent";
import { MessageStatus } from "./MessageStatus";
interface MessageListProps {
  messages: Message[];
  currentUserId: string | undefined;
}

export default function MessageList({
  messages,
  currentUserId,
}: MessageListProps) {
  return (
    <div className="flex-1 p-4 overflow-y-scroll">
      <div className="space-y-4">
        {messages.map((message) => {
          const isCurrentUser = currentUserId === message.senderId;
          return (
            <div
              key={message._id}
              className={`flex items-center gap-2 ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isCurrentUser && (
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/avatars/${message.senderId}.png`} />
                  <AvatarFallback>SN</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`flex flex-col ${
                  isCurrentUser ? "items-end" : "items-start"
                }`}
              >
                {!isCurrentUser && (
                  <span className="text-xs text-muted-foreground mb-1">
                    {message.senderId}
                  </span>
                )}
                <div
                  className={cn(
                    "max-w-md border rounded-lg p-2",
                    isCurrentUser && "bg-blue-500"
                  )}
                >
                  <MessageContent
                    content={message.content}
                    type={message.type}
                  />

                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-xs opacity-70">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isCurrentUser && <MessageStatus status={message.status} />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
