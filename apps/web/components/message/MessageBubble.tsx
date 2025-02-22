import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MessageContent } from "./MessageContent";
import { MessageStatus } from "./MessageStatus";
import { Message } from "@/types/message";
import { UserAvatar } from "../shared/UserAvatar";
import { Pencil, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { socketService } from "@/services/socket/socketService";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble = ({ isOwn, message }: MessageBubbleProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [reactions, setReactions] = useState<string[]>(["⭐️", "☠️"]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const { _id, content, type, status, timestamp, senderId } = message;
  const reaction = "😂❤️";
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
          <div className="absolute -top-10 z-20 flex items-center gap-2 px-2 py-1 mb-1 border rounded-md bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {["😬", "🥶", "🦋", "⭐️", "👍🏻", "🤩"].map((item, key) => (
              <div
                className="hover:scale-150 transition-transform ease-in-out duration-300 text-2xl cursor-pointer"
                key={key}
                onClick={() => {
                  setReactions([...reactions, item]);
                }}
              >
                {item}
              </div>
            ))}
          </div>

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
                "max-w-md rounded-2xl p-2 relative shadow-sm",
                isOwn
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-bl-none"
              )}
            >
              {!isOwn && (
                <span className="text-xs font-medium text-muted-foreground mb-1">
                  {senderId.username || "User"}
                </span>
              )}
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent bg-white text-neutral-900"
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
                <div className="flex flex-col">
                  <MessageContent content={content} type={type} />
                  <div className="flex gap-1 bg-white/40 border rounded-xl px-1 py-0.5 w-fit">
                    {reactions.map((reaction, idx) => (
                      <span key={idx}>{reaction}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-4">
                {message.edited && (
                  <span className="text-xs opacity-60">(edited)</span>
                )}
                <span className="text-xs opacity-30">
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
