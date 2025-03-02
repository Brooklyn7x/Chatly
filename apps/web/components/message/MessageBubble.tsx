import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MessageContent } from "./MessageContent";
import { UserAvatar } from "../shared/UserAvatar";
import { Message } from "@/types/message";
import { socketService } from "@/services/socket/socketService";
import { MessageActions } from "./MessageActions";
import { MessageMetadata } from "./MessageMetadata";
import { MessageEditor } from "./MessageEditor";
import { MessageReactionPicker } from "./MessageReactionPicker";
import { MessageReactions } from "./MessageReactions";
import { useReactions } from "@/hooks/useReactions";
import { useMessageEdit } from "@/hooks/useMessageEditing";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble = ({ isOwn, message }: MessageBubbleProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const {
    _id,
    content,
    type,
    status,
    timestamp,
    senderId,
    edited,
    attachments,
  } = message;

  const {
    isEditing,
    editedContent,
    setEditedContent,
    setIsEditing,
    handleEdit,
  } = useMessageEdit(content, _id);
  const { reactions, addReaction, removeReaction } = useReactions(message._id);

  const handleEditMessage = () => {
    if (editedContent.trim() && editedContent !== content) {
      socketService.editMessage(_id, editedContent);
    }
    setIsEditing(false);
  };

  const handleDeleteMessage = () => {
    socketService.deleteMessage(_id);
    setShowMenu(false);
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
          <UserAvatar url="https://api.dicebear.com/9.x/avataaars/svg?seed=Ryker" />
        </div>
      )}
      <div
        className="flex flex-col gap-1"
        ref={bubbleRef}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowMenu(true);
        }}
      >
        <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
          <div className="flex items-center gap-2">
            {isOwn && (
              <MessageActions
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
              />
            )}

            <div
              className={cn(
                "max-w-md rounded-2xl p-3 relative shadow-sm transition-all",
                isOwn
                  ? "bg-primary rounded-br-none hover:shadow-md"
                  : "bg-secondary text-primary rounded-bl-none hover:shadow-md"
              )}
            >
              {!isOwn && (
                <span className="text-xs font-medium mb-1 block">
                  {senderId.username || "User"}
                </span>
              )}
              {isEditing ? (
                <MessageEditor
                  content={editedContent}
                  onChange={setEditedContent}
                  onSave={handleEdit}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <div className="flex flex-col gap-1">
                  <MessageContent
                    content={content}
                    type={type}
                    attachments={attachments}
                  />
                  {reactions.length > 0 && (
                    <MessageReactions
                      reactions={reactions}
                      onRemove={removeReaction}
                    />
                  )}
                </div>
              )}

              <MessageMetadata
                timestamp={timestamp}
                status={status}
                isOwn={isOwn}
                isEdited={edited}
              />
            </div>
          </div>
        </div>
      </div>
      <MessageReactionPicker
        onSelect={addReaction}
        position={isOwn ? "right" : "left"}
      />
    </motion.div>
  );
};


