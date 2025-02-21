import { cn } from "@/lib/utils";
import { User } from "@/types";
import { UserAvatar } from "../shared/UserAvatar";
import { useUserStatus } from "@/hooks/useUserStatus";

interface UserItemProps {
  user: User;
  selected?: boolean;
}

export const UserItem = ({ user, selected }: UserItemProps) => {
  const { id, username, email, profilePicture } = user;
  const { getStatusText } = useUserStatus(id);
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
        <div className="flex items-center justify-between font-semibold truncate">
          <span >{username || "User"}</span>{" "}
          <span className="text-sm text-muted-foreground">{getStatusText()}</span>
        </div>

        <div className="text-muted-foreground text-sm truncate">
          {email || "email"}
        </div>
      </div>
    </div>
  );
};
