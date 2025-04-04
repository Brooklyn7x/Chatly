import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useMessageStore } from "@/store/useMessageStore";
import { useChatStore } from "@/store/useChatStore";
import { Message } from "@/types";

const filterMessages = (messages: any[], searchTerm: string) => {
  if (!searchTerm.trim()) return messages;
  return messages.filter(
    (msg) =>
      msg.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.sender?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

const MessageSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const messagesMap = useMessageStore((state) => state.messages);
  const messages = activeChatId ? messagesMap[activeChatId] || [] : [];
  const filteredMessages = filterMessages(messages, query);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Escape":
        setOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => {
          const newIndex = prev < filteredMessages.length - 1 ? prev + 1 : prev;
          return newIndex;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => {
          const newIndex = prev > 0 ? prev - 1 : prev;
          return newIndex;
        });
        break;
      case "Enter":
        if (selectedIndex >= 0 && selectedIndex < filteredMessages.length) {
          const selectedMessage = filteredMessages[selectedIndex];
          console.log("Navigating to:", selectedMessage);
        }
        break;
      default:
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent">
          <Search className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="min-h-[60vh] min-w-[50vw]">
        <DialogHeader>
          <DialogTitle>Search Messages</DialogTitle>
          <div className="flex flex-col gap-4 pt-4">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search messages..."
              className="focus-visible:ring-2 focus-visible:ring-primary"
              onKeyDown={handleKeyDown}
            />
            <div
              ref={messagesContainerRef}
              className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto pr-2"
            >
              {filteredMessages?.map((msg: Message, index) => (
                <div
                  key={msg.id}
                  className={cn(
                    "p-3 hover:bg-accent rounded-lg cursor-pointer group transition-colors",
                    "border border-transparent hover:border-primary/20",
                    index === selectedIndex && "bg-accent"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-primary">
                        {msg.senderId.username || "User"}
                      </p>
                      {/* {msg.isPinned && (
                        <span className="text-xs px-2 py-1 rounded-full">
                          Pinned
                        </span>
                      )} */}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                  <p className="text-sm mt-1 group-hover:text-primary">
                    {msg.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default MessageSearch;
