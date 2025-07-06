import {
  MessageSquareTextIcon,
  Speaker,
  StarIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

type FilterOption = {
  label: string;
  value: "all" | "favorites" | "groups" | "direct" | "channel";
  icon: React.ReactNode;
};
const filterOptions: FilterOption[] = [
  {
    label: "All Messages",
    value: "all",
    icon: <MessageSquareTextIcon className="h-4 w-4" />,
  },
  {
    label: "Direct Messages",
    value: "direct",
    icon: <UserIcon className="h-4 w-4" />,
  },
  {
    label: "Group Chats",
    value: "groups",
    icon: <UsersIcon className="h-4 w-4" />,
  },
  {
    label: "Channel",
    value: "channel",
    icon: <Speaker className="h-4 w-4" />,
  },
  {
    label: "Favorites",
    value: "favorites",
    icon: <StarIcon className="h-4 w-4" />,
  },
];
interface ChatFilterProps {
  selectedFilter: FilterOption["value"];
  onFilterChange: (value: FilterOption["value"]) => void;
}
export default function ChatFilters({
  selectedFilter,
  onFilterChange,
}: ChatFilterProps) {
  const handleFilterChange = (value: FilterOption["value"]) => {
    onFilterChange(value);
  };
  
  return (
    <div className="flex items-center gap-2 py-2 px-2 overflow-x-auto scrollbar-hide">
      {filterOptions.map((options) => (
        <button
          key={options.value}
          onClick={() => handleFilterChange(options.value)}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 border rounded-2xl transition-colors ${
            selectedFilter === options.value
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
        >
          {options.icon}
          <span className="text-sm font-medium">{options.label}</span>
        </button>
      ))}
    </div>
  );
}
