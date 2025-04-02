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

const generateMockMessages = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    message: [
      "Hey, how's it going?",
      "Don't forget our meeting at 2 PM",
      "Here's the document you requested",
      "Let's catch up this weekend!",
      "What do you think about the new design?",
      "I'll send you the details shortly",
      "Can we reschedule for tomorrow?",
      "The project is almost complete",
      "Let me know if you need any help",
      "I'm running a bit late, sorry!",
    ][i % 10],
    timestamp: new Date(Date.now() - i * 3600000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    sender: i % 2 === 0 ? "You" : "Other User",
    isPinned: i % 5 === 0,
  }));
};

const filMessages = (messages: any[], searchTerm: string) => {
  if (!searchTerm.trim()) return messages;
  return messages.filter(
    (msg) =>
      msg.message?.toLowerCase().includes(searchTerm) ||
      msg.sender.toLowerCase().includes(searchTerm)
  );
};

const MessageSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const messages = useMessageStore((state) => state.messages) || [];
  const filterMessages = filMessages(generateMockMessages(), query);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Escape":
        setOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => {
          const newIndex = prev < filterMessages.length - 1 ? prev + 1 : prev;
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
        if (selectedIndex >= 0 && selectedIndex < filterMessages.length) {
          const selectedMessage = filterMessages[selectedIndex];
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
              placeholder="Search messages."
              className="focus-visible:ring-2 focus-visible:ring-primary"
            />
            <div
              onKeyDown={handleKeyDown}
              ref={messagesContainerRef}
              className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto pr-2"
            >
              {filterMessages?.map((msg, index) => (
                <div
                  key={msg.id}
                  className={cn(
                    "p-3 hover:bg-accent rounded-lg cursor-pointer group transition-colors",
                    "border border-transparent hover:border-primary/20",
                    msg.isPinned && "bg-yellow-50/50 hover:bg-yellow-500/50",
                    index === selectedIndex && "bg-accent"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-primary">
                        {msg.sender}
                      </p>
                      {msg.isPinned && (
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                          Pinned
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {msg.timestamp}
                    </p>
                  </div>
                  <p className="text-sm mt-1 group-hover:text-primary">
                    {msg.message}
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
