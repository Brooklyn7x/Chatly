import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MessageContent } from "./MessageContent";
import { MessageStatus } from "./MessageStatus";
import { Message } from "@/types/message";
import { UserAvatar } from "../shared/UserAvatar";
import { Pencil, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useChatStore } from "@/store/useChatStore";
import { socketService } from "@/services/socket/socketService";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble = ({ isOwn, message }: MessageBubbleProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const { _id, content, type, status, timestamp, senderId } = message;

  const handleEdit = () => {
    if (editedContent.trim() && editedContent !== content) {
      socketService.editMessage(_id, editedContent);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    socketService.deleteMessage(_id);
    setShowMenu(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      key={_id}
      className={`group relative flex items-center ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className="flex gap-3 items-center"
        ref={bubbleRef}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowMenu(true);
        }}
      >
        {!isOwn && (
          <UserAvatar url="https://api.dicebear.com/9.x/avataaars/svg?seed=Ryker" />
        )}
        <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
          {!isOwn && (
            <span className="text-xs text-muted-foreground mb-1">
              {senderId.username || "User"}
            </span>
          )}
          <div className="flex items-center gap-2">
            {isOwn && (
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="outline"
                  size="sm"
                  className="p-1.5 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background border shadow-sm"
                  onClick={() => setIsEditing(true)}
                  title="Edit message"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="p-1.5 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-red-50 border-red-200 text-red-500 hover:text-red-600 shadow-sm"
                  onClick={handleDelete}
                  title="Delete message"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div
              className={cn(
                "max-w-md border rounded-lg p-2 relative",
                isOwn && "bg-blue-500"
              )}
            >
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                    autoFocus
                    rows={Math.min(
                      Math.max(editedContent.split("\n").length, 1),
                      5
                    )}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleEdit}
                      className="hover:bg-blue-600"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <MessageContent content={content} type={type} />
              )}

              <div className="flex items-center justify-end gap-1 mt-1">
                {message.edited && (
                  <span className="text-xs opacity-50">(edited)</span>
                )}
                <span className="text-xs opacity-70">
                  {new Date(timestamp || new Date()).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {isOwn && <MessageStatus status={status} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
