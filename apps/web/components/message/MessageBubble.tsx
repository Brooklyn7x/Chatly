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
  const [reactions, setReactions] = useState<string[]>([]);
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
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1.5 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary/10 border border-primary/20 text-primary hover:text-primary/90 shadow-sm hover:shadow-md transition-all hover:scale-105"
                  onClick={() => setIsEditing(true)}
                  title="Edit message"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1.5 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border hover:bg-primary/10 shadow-sm hover:shadow-md transition-all hover:scale-105"
                  onClick={handleDelete}
                  title="Delete message"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div
              className={cn(
                "max-w-md rounded-2xl p-3 relative shadow-sm transition-all",
                isOwn
                  ? "bg-primary text-white rounded-br-none hover:shadow-md"
                  : "bg-secondary rounded-bl-none hover:shadow-md"
              )}
            >
              {!isOwn && (
                <span className="text-xs font-medium text-muted-foreground mb-1 block">
                  {senderId.username || "User"}
                </span>
              )}
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-2 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent bg-white/90 text-neutral-900 transition-all"
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
                      variant={"outline"}
                      onClick={handleEdit}
                      className="bg-primary text-white transition-colors"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <MessageContent content={content} type={type} />
                  {reactions.length > 0 && (
                    <div className="flex gap-1 bg-white/40 border rounded-full px-2 py-1 w-fit mt-1 backdrop-blur-sm">
                      {reactions.map((reaction, idx) => (
                        <span
                          key={idx}
                          className="hover:scale-110 transition-transform cursor-pointer"
                          onClick={() => {
                            setReactions(reactions.filter((_, i) => i !== idx));
                          }}
                        >
                          {reaction}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 mt-1">
                {message.edited && (
                  <span className="text-xs opacity-60 italic">(edited)</span>
                )}
                <span className="text-xs opacity-50">
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

      <div
        className={`absolute -top-8 ${isOwn ? "right-0" : "left-0"} flex gap-1 p-1.5 bg-background/95 backdrop-blur-sm rounded-full shadow-lg border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out`}
      >
        {["👍", "❤️", "😂", "😮", "👏"].map((emoji, index) => (
          <button
            key={index}
            className="p-1.5 hover:scale-110 active:scale-95 transition-transform duration-150 ease-in-out hover:bg-accent/50 rounded-full"
            onClick={() => setReactions([...reactions, emoji])}
          >
            <span className="text-xl hover:drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
              {emoji}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
