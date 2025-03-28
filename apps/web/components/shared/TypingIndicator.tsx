export function TypingIndicator() {
  return (
    <div className="fixed bottom-14 ml-6 mb-4 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-background/60 backdrop-blur-sm border rounded-full w-16">
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
      </div>
    </div>
  );
}
