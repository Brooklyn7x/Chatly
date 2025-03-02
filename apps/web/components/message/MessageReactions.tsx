interface MessageReactionsProps {
  reactions: string[];
  onRemove: (index: number) => void;
}

export function MessageReactions({
  reactions,
  onRemove,
}: MessageReactionsProps) {
  return (
    <div className="flex gap-1 bg-white/40 border rounded-full px-2 py-1 w-fit mt-1 backdrop-blur-sm">
      {reactions.map((reaction, idx) => (
        <span
          key={idx}
          className="hover:scale-110 transition-transform cursor-pointer"
          onClick={() => onRemove(idx)}
          aria-label={`Remove ${reaction} reaction`}
        >
          {reaction}
        </span>
      ))}
    </div>
  );
}
