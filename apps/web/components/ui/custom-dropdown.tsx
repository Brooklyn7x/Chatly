"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface CustomDropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  trigger,
  children,
  align = "end",
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div ref={dropdownRef} className="relative">
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2",
            align === "start" && "left-0",
            align === "center" && "left-1/2 -translate-x-1/2",
            align === "end" && "right-0",
            "top-full mt-1",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

interface CustomDropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const CustomDropdownItem: React.FC<CustomDropdownItemProps> = ({
  children,
  onClick,
  className,
  disabled = false,
}) => {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CustomDropdownSeparator: React.FC<{ className?: string }> = ({
  className,
}) => {
  return <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />;
};
