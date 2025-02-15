import { cn } from "@/lib/utils";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatHeaderMenuProps {
  onClose: () => void;
  chatId: string;
  onDeleteChat: (chatId: string) => void;
}

export default function ChatHeaderMenu({
  onClose,
  chatId,
  onDeleteChat,
}: ChatHeaderMenuProps) {
  const menuRef = useRef(null);

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-background/50 backdrop-blur-sm absolute mt-2 top-full right-5 origin-top-right border rounded-lg shadow-lg py-2 min-w-[200px]"
    >
      <ChatMenuItem
        onClick={() => {
          onDeleteChat(chatId);
          onClose();
        }}
        label="Delete"
      />
    </motion.div>
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
