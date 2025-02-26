import React from "react";
import { cn } from "@/lib/utils";

interface FloatinButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const FloatinButton = ({
  children,
  onClick,
  className,
  disabled,
}: FloatinButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        className,
        "h-14 w-14 flex items-center justify-center bg-secondary rounded-full shadow-lg hover:bg-primary/40 transition-all duration-200 active:scale-95 focus:outline-none",
        "disabled:bg-secondary/50"
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default FloatinButton;
