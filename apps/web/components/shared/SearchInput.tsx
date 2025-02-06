import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder,
}: SearchInputProps) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full h-10 pl-12 pr-4",
          "rounded-full bg-muted/50",
          "outline-none focus:right-2 focus:ring-blue-500"
        )}
        placeholder={placeholder}
      />
    </div>
  );
};
