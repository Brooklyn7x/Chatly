import { cn } from "@/lib/utils";
import { User } from "@/types";

interface UserItemProps {
  user: User;
  selected?: boolean;
}

export const UserItem = ({ user, selected }: UserItemProps) => {
  return (
    <div
      className={cn(
        "p-2 rounded-md cursor-pointer",
        "flex items-center gap-4",
        "hover:bg-muted/40 transition-colors duration-200",
        selected && "bg-muted/80"
      )}
    >
      <div className="relative flex-shrink-0 h-12 w-12">
        <div className="h-full w-full rounded-full overflow-hidden">
          <img
            src="/user.jpeg"
            className="h-full w-full object-cover"
            alt="user-image"
          />
        </div>
        <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-500 rounded-full ring-2 ring-background" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-semibold truncate">{user.username || "User"}</div>
        <div className="text-muted-foreground text-sm truncate">
          Last message
        </div>
      </div>
    </div>
  );
};
