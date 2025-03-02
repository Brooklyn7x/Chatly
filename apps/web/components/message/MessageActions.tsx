import { Pencil, Trash } from "lucide-react";
import { Button } from "../ui/button";

interface MessageActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function MessageActions({ onEdit, onDelete }: MessageActionsProps) {
  return (
    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <Button
        variant="ghost"
        size="sm"
        className="p-1.5 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary/10 border border-primary/20 shadow-sm hover:shadow-md transition-all hover:scale-105"
        onClick={onEdit}
        title="Edit message"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="p-1.5 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border hover:bg-primary/10 shadow-sm hover:shadow-md transition-all hover:scale-105"
        onClick={onDelete}
        title="Delete message"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
