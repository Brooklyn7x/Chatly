import { useChatStore } from "@/store/useChatStore";
import { useAppStore } from "@/store/useAppStore";

interface TypingIndicatorProps {
  chatId: string;
}

const TypingIndicator = ({ chatId }: TypingIndicatorProps) => {
  const { typingUsers } = useChatStore();
  const { user } = useAppStore();

  const chatTypingUsers = typingUsers[chatId] || [];
  const otherUsersTyping = chatTypingUsers.filter(
    (userId) => userId !== user?.id
  );

  if (otherUsersTyping.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
        </div>
        <span>
          {otherUsersTyping.length === 1
            ? "Someone is typing..."
            : `${otherUsersTyping.length} people are typing...`}
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;
