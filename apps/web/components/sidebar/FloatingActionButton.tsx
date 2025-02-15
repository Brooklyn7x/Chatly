import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, User, Users, Volume, X } from "lucide-react";
type ViewType = "main" | "search" | "new_message" | "new_group" | "new_channel";
interface FBAProps {
  view: string;
  onViewChange: (view: ViewType) => void;
}

export const FloatingActionButton = ({ view, onViewChange }: FBAProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (view !== "main") return null;

  return (
    <div className="absolute bottom-6 right-6">
      {isOpen && (
        <motion.div
          initial={{}}
          animate={{}}
          exit={{}}
          className="absolute bottom-16 right-0 w-48 border bg-background/70 backdrop-blur-md rounded-lg shadow-xl py-2"
        >
          <button
            onClick={() => onViewChange("new_message")}
            className="flex items-center px-4 py-2 hover:bg-hover w-full"
          >
            <Volume className="w-5 h-5 mr-3" />
            New Chat
          </button>
          <button
            onClick={() => onViewChange("new_group")}
            className="flex items-center px-4 py-2 hover:bg-hover w-full"
          >
            <Users className="w-5 h-5 mr-3" />
            New Group
          </button>
          <button
            onClick={() => onViewChange("new_channel")}
            className="flex items-center px-4 py-2 hover:bg-hover w-full"
          >
            <User className="w-5 h-5 mr-3" />
            New Channel
          </button>
        </motion.div>
      )}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Pencil className="w-6 h-6" />}
      </button>
    </div>
  );
};
