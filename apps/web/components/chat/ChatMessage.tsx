import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Ban,
  Check,
  CheckCheck,
  CircleX,
  Ellipsis,
  FileIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useMessage } from "@/hooks/message/useMessage";
import { Message } from "@/types";

interface MessageProps {
  message: Message;
  isOwn: boolean;
}

const MessageItem = ({ message, isOwn }: MessageProps) => {
  const {
    _id,
    conversationId,
    type,
    content,
    status,
    isEdited,
    isDeleted,
    updatedAt,
  } = message;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState<string>(content);
  const messageRef = useRef<HTMLDivElement>(null);

  const { editMessage, deleteMessage, markAsRead } = useMessage();

  const time = useMemo(() => {
    if (!updatedAt) return "";
    return new Date(updatedAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [updatedAt]);

  const handleEditMessage = () => {
    if (!editContent.trim()) return;
    editMessage({
      message,
      conversationId: message.conversationId,
      messageId: _id,
      content: editContent,
    });

    setIsEditing(false);
  };
  const handleDeleteMessage = () => {
    deleteMessage(_id, message);
  };

  useEffect(() => {
    if (isOwn || message?.status === "read") return;
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            markAsRead({ chatId: conversationId, messageId: message._id });
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => {
      if (messageRef.current) observer.disconnect();
    };
  }, [message, isOwn]);

  return (
    <div
      className={`w-full flex ${isOwn ? "justify-end" : "justify-start"}`}
      ref={messageRef}
    >
      <div
        className={`flex items-center gap-2 max-w-[80%] group ${isOwn ? "flex-row-reverse" : "flex-row"}`}
      >
        <div
          className={`${isOwn ? "bg-primary text-primary-foreground" : "bg-muted"} p-3 rounded-lg text-sm`}
        >
          {isDeleted ? (
            <p
              className={`${!isOwn && "text-muted-foreground"} italic flex items-center gap-1`}
            >
              <span>
                <Ban size={14} />
              </span>
              <span>This message was deleted</span>
            </p>
          ) : isEditing && type === "text" ? (
            <div className="min-w-[200px]">
              <Input
                value={editContent}
                onChange={(e) => setEditContent?.(e.target.value)}
                className="bg-background/50 border-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleEditMessage();
                  } else if (e.key === "Escape") {
                    setIsEditing(false);
                  }
                }}
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  className="h-7 px-2"
                >
                  Cancel
                </Button>
                <Button
                  variant={"outline"}
                  className="h-7 px-2 text-muted-foreground"
                  onClick={handleEditMessage}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div>
                {type === "text" ? (
                  <p className="break-words">{content}</p>
                ) : type === "image" ? (
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={"/user.jpeg"}
                      alt="Image"
                      height={300}
                      width={300}
                      className="max-h-[300px] w-full object-cover rounded-lg"
                    />
                  </div>
                ) : type === "file" ? (
                  <div className="p-2 flex gap-2 text-muted-foreground">
                    <FileIcon size={24} />
                    <div className="flex flex-col gap-2">
                      <p className="">
                        important_documents.pdf <span>(50kb)</span>
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        <Button variant={"outline"} size={"sm"}>
                          Download
                        </Button>
                        <Button variant={"outline"} size={"sm"}>
                          Preview
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex items-center justify-end gap-2 mt-1">
                {isEdited && (
                  <span className="text-xs opacity-70 italic">Edited</span>
                )}
                <p className="text-[11px] opacity-70">{time}</p>
                {isOwn && (
                  <span>
                    {status === "read" ? (
                      <CheckCheck className="text-blue-500" size={14} />
                    ) : status === "sent" ? (
                      <Check size={14} />
                    ) : status === "delivered" ? (
                      <CheckCheck size={14} />
                    ) : status === "failed" ? (
                      <CircleX size={14} />
                    ) : null}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {!isDeleted && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon"} className="h-8 w-8">
                  <Ellipsis size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isOwn ? "start" : "end"}
                className="bg-background"
              >
                <DropdownMenuItem>Forward</DropdownMenuItem>
                {isOwn && (
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>Star</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteMessage}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
