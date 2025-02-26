export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 bg-background/60 backdrop-blur-sm border rounded-full w-14">
      <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
    </div>
  );
}
