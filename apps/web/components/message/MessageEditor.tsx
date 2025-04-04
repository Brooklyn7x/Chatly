import { Button } from "../ui/button";

interface MessageEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function MessageEditor({
  content,
  onChange,
  onSave,
  onCancel,
}: MessageEditorProps) {
  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent text-white transition-all"
        autoFocus
        rows={Math.min(Math.max(content.split("\n").length, 1), 5)}
      />
      <div className="flex gap-2 justify-end">
        <Button size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          variant={"outline"}
          onClick={onSave}
          className="transition-colors"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
