import { Edit2, User, Users, Volume, X } from "lucide-react";
import { useState } from "react";

interface FBAProps {
  view: string;
  onNewMessage: () => void;
  onNewGroup: () => void;
  onNewChannel: () => void;
}

export const FloatingActionButton = ({
  view,
  onNewMessage,
  onNewGroup,
  onNewChannel,
}: FBAProps) => {
  const [showOptions, setShowOptions] = useState(false);

  if (view !== "main") return null;

  return (
    <div className="absolute bottom-6 right-6">
      {showOptions && (
        <div className="absolute bottom-16 right-0 w-48 border bg-background/70 backdrop-blur-md rounded-lg shadow-xl py-2">
          <button
            onClick={onNewChannel}
            className="flex items-center px-4 py-2 hover:bg-hover w-full"
          >
            <Volume className="w-5 h-5 mr-3" />
            New Channel
          </button>
          <button
            onClick={onNewGroup}
            className="flex items-center px-4 py-2 hover:bg-hover w-full"
          >
            <Users className="w-5 h-5 mr-3" />
            New Group
          </button>
          <button
            onClick={onNewMessage}
            className="flex items-center px-4 py-2 hover:bg-hover w-full"
          >
            <User className="w-5 h-5 mr-3" />
            New Message
          </button>
        </div>
      )}
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors"
      >
        {showOptions ? (
          <X className="w-6 h-6" />
        ) : (
          <Edit2 className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};
