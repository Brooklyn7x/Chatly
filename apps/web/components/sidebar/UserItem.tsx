import { cn } from "@/lib/utils";
import { User } from "@/types";
import { UserAvatar } from "../shared/UserAvatar";

interface UserItemProps {
  user: User;
  selected?: boolean;
}

export const UserItem = ({ user, selected }: UserItemProps) => {
  const { username, email, profilePicture } = user;
  return (
    <div
      className={cn(
        "p-2 rounded-md cursor-pointer",
        "flex items-center gap-4",
        "hover:bg-muted/60 transition-colors duration-200",
        selected && "bg-muted/80"
      )}
    >
      <div className="relative flex-shrink-0 h-12 w-12">
        <UserAvatar size={"md"} url={profilePicture} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-semibold truncate">{username || "User"}</div>

        <div className="text-muted-foreground text-sm truncate">
          {email || "email"}
        </div>
      </div>
    </div>
  );
};
