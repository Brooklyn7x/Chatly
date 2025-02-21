import { cn } from "@/lib/utils";

export const TypingIndicator = () => {
  return (
    <div className="w-16 h-6 ml-2 mb-2 bg-background/80 rounded-full p-1 flex items-center justify-center">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-2 w-2 rounded-full bg-white/80",
              "animate-pulse",
              i === 1 && "delay-75",
              i === 2 && "delay-150"
            )}
          />
        ))}
      </div>
    </div>
  );
};
