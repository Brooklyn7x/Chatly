import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
}

export const Spinner = ({ className }: SpinnerProps) => {
  return <LoaderIcon className={cn("animate-spin", className)} />;
}; 