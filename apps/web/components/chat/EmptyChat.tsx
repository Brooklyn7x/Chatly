import { MessageCircle } from "lucide-react";

export function EmptyChat() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-muted-foreground bg-background/50 backdrop-blur-sm">
        <MessageCircle className="h-12 w-12 mb-4 text-primary/50" />
        <p className="text-lg font-medium mb-2">No conversations yet</p>
        <p className="text-sm">Start a new chat to begin your conversation!</p>
      </div>
    </div>
  );
}
