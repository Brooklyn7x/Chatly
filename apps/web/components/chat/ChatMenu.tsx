import { cn } from "@/lib/utils";

export default function ChatMenu({
  isOpen,
  chatId,
  onClose,
  onDelete,
}: {
  isOpen: boolean;
  chatId: string;
  onClose: () => void;
  onDelete: (chatId : string) => void;
}) {
  return (
    <div
      className={cn(
        "absolute top-full right-2 w-[200px] py-2",
        "bg-background/50 backdrop-blur-sm",
        "border rounded-md shadow-md",
        "transition-all duration-300 ease-in-out transform",
        isOpen
          ? "opacity-100 scale-100 translate-y-1"
          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
      )}
    >
      <ChatMenuItem
        onClick={() => {
          onDelete(chatId);
          onClose();
        }}
        label="Delete"
      />
    </div>
  );
}

interface ChatMenuItemProps {
  onClick: () => void;
  label: string;
}

const ChatMenuItem = ({ onClick, label }: ChatMenuItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full px-4 py-2 text-sm text-left",
        "hover:bg-muted/50 transition-colors"
      )}
    >
      {label}
    </button>
  );
};
