import { cn } from "@/lib/utils";

interface AuthButtonProps {
  onClick: () => void;
  className?: string;
  label: string;
}

export default function AuthButton({
  onClick,
  className,
  label,
}: AuthButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "py-3 px-4 border rounded-md hover:bg-slate-50 shadow-sm hover:shadow-md transition-all hover:scale-105 ease-in-out duration-300 delay-150",
        className
      )}
    >
      {label}
    </button>
  );
}
