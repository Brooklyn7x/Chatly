import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MessageContent } from "./MessageContent";
import { UserAvatar } from "../shared/UserAvatar";
import { MessageActions } from "./MessageActions";
import { MessageMetadata } from "./MessageMetadata";
import { MessageEditor } from "./MessageEditor";
import { MessageReactionPicker } from "./MessageReactionPicker";
import { MessageReactions } from "./MessageReactions";
import { useReactions } from "@/hooks/chat/useReactions";
import { Message } from "@/types";
import { useSocketStore } from "@/store/useSocketStore";
import { useMessageStore } from "@/store/useMessageStore";
import { useMessage } from "@/hooks/message/useMessage";
import { useChatStore } from "@/store/useChatStore";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble = ({ isOwn, message }: MessageBubbleProps) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const chatId = useChatStore((state) => state.activeChatId);
  const [isEditing, setIsEditing] = useState(false);
  const [showreaction, setShowReaction] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const { socket } = useSocketStore();
  const { updateMessage } = useMessageStore();
  const { editMessage, deleteMessage, markAsRead } = useMessage();
  const { reactions, addReaction, removeReaction } = useReactions(message._id);

  useEffect(() => {
    if (!chatId || isOwn || message?.status === "read") return;
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            markAsRead({ chatId, messageId: message._id });
            console.log(message._id, "unread");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [message, isOwn]);

  const {
    id,
    _id,
    content,
    type,
    status,
    createdAt,
    senderId,
    isEdited,
    isDeleted,
  } = message;

  const handleEditMessage = () => {
    if (!socket) return;
    if (editedContent.trim() && editedContent !== content) {
      editMessage({ messageId: _id, content: editedContent });
      updateMessage(message.conversationId, {
        ...message,
        content: editedContent,
        isEdited: true,
      });
    }
    setIsEditing(false);
  };

  const handleDeleteMessage = () => {
    if (!socket) return;
    deleteMessage(id);
    updateMessage(message.conversationId, {
      ...message,
      isDeleted: true,
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      key={_id}
      className={`group relative flex items-end gap-2 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {!isOwn && (
        <div className="flex-shrink-0">
          <UserAvatar />
        </div>
      )}
      <div
        className="flex flex-col gap-1"
        ref={bubbleRef}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <div
          className={`flex flex-col relative  ${isOwn ? "items-end" : "items-start"}`}
        >
          <div className="flex items-center gap-2" ref={ref}>
            {/* <div className="absolute -right-2 -top-1 z-20">
              <MessageActionDrop />
            </div> */}
            {isOwn && !message.isDeleted && (
              <MessageActions
                onReaction={() => setShowReaction((prev) => !prev)}
                onEdit={() => setIsEditing(true)}
                onDelete={handleDeleteMessage}
              />
            )}

            <div
              className={cn(
                "max-w-md rounded-2xl p-3 relative shadow-sm transition-all",
                isOwn
                  ? "bg-primary/90 rounded-br-none hover:shadow-md"
                  : "bg-secondary/90 text-white rounded-bl-none hover:shadow-md",
                message.isDeleted && "opacity-70"
              )}
            >
              {!isOwn && (
                <span className="text-xs font-medium mb-1 block">
                  {senderId?.username || "User"}
                </span>
              )}
              {isEditing ? (
                <MessageEditor
                  content={editedContent}
                  onChange={setEditedContent}
                  onSave={handleEditMessage}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <div className="flex flex-col gap-1">
                  {isDeleted ? (
                    <span className="text-muted-foreground italic">
                      message deleted
                    </span>
                  ) : (
                    <MessageContent
                      isOwn={isOwn}
                      content={content}
                      type={type}
                      attachments={[]}
                    />
                  )}
                  {reactions.length > 0 && (
                    <MessageReactions
                      reactions={reactions}
                      onRemove={removeReaction}
                    />
                  )}
                </div>
              )}

              <MessageMetadata
                timestamp={createdAt}
                status={status}
                isOwn={isOwn}
                isEdited={isEdited}
                isDeleted={isDeleted}
              />
            </div>
          </div>
        </div>
      </div>

      {showreaction && (
        <MessageReactionPicker
          onSelect={addReaction}
          position={isOwn ? "right" : "left"}
        />
      )}
    </motion.div>
  );
};
