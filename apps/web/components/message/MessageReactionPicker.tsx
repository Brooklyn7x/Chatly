import { Button } from "../ui/button";

const REACTIONS = ["👍", "❤️", "😂", "😮", "👏"];

interface MessageReactionPickerProps {
  onSelect: (reaction: string) => void;
  position: "left" | "right";
}

export function MessageReactionPicker({
  onSelect,
  position,
}: MessageReactionPickerProps) {
  return (
    <div
      className={`absolute -top-8 ${position === "right" ? "right-0" : "left-0"} flex gap-1 p-1.5 bg-background/95 backdrop-blur-sm rounded-full shadow-lg border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out`}
    >
      {REACTIONS.map((emoji, index) => (
        <button
          key={index}
          className="p-1.5 hover:scale-110 active:scale-95 transition-transform duration-150 ease-in-out hover:bg-accent/50 rounded-full"
          onClick={() => onSelect(emoji)}
          aria-label={`React with ${emoji}`}
        >
          <span className="text-xl hover:drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
            {emoji}
          </span>
        </button>
      ))}
    </div>
  );
}
