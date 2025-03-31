export function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex items-center justify-center rounded-lg border border-dashed p-4 text-center text-muted-foreground">
        <p>No conversations yet. Start a new chat!</p>
      </div>
    </div>
  );
}
