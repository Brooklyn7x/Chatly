import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageContent } from "./MessageContent";
import { MessageStatus } from "./MessageStatus";
import { Message } from "@/types/message";
import { UserAvatar } from "../shared/UserAvatar";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble = ({ isOwn, message }: MessageBubbleProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      key={message._id}
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
              {message.senderId?.username || "User"}
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

      <AnimatePresence>{showMenu && <h1></h1>}</AnimatePresence>
    </motion.div>
  );
};
