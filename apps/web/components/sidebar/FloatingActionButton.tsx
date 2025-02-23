import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Pencil, User, Users, Volume, X } from "lucide-react";
import { useClickAway } from "@/hooks/useClickAway";

type ViewType = "main" | "search" | "new_message" | "new_group" | "new_channel";
interface FBAProps {
  view: string;
  onViewChange: (view: ViewType) => void;
}

export const FloatingActionButton = ({ view, onViewChange }: FBAProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useClickAway(popupRef, () => {
    setIsOpen(false);
  });

  if (view !== "main") return null;

  return (
    <div className="absolute bottom-6 right-6" ref={popupRef}>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-20 right-0 w-56 border bg-background/80 backdrop-blur-lg rounded-xl shadow-2xl py-2 px-2 space-y-1"
        >
          <button
            onClick={() => onViewChange("new_message")}
            className="flex items-center px-4 py-3 gap-3 hover:bg-muted/50 rounded-lg w-full text-sm font-medium transition-all duration-200"
          >
            <Volume className="w-5 h-5 text-primary" />
            <span>New Chat</span>
          </button>
          <button
            onClick={() => onViewChange("new_group")}
            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 rounded-lg w-full text-sm font-medium transition-all duration-200"
          >
            <Users className="w-5 h-5 text-primary" />
            <span>New Group</span>
          </button>
        </motion.div>
      )}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Pencil className="w-6 h-6" />}
      </button>
    </div>
  );
};
