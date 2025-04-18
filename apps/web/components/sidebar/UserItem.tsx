import { cn } from "@/lib/utils";
import { User } from "@/types";

import useUserStatusStore from "@/store/useUserStatusStore";
import { UserAvatar } from "../common/UserAvatar";

interface UserItemProps {
  user: User;
  selected?: boolean;
}

export const UserItem = ({ user, selected }: UserItemProps) => {
  const { id, username, profilePicture } = user;
  const { getUserStatus } = useUserStatusStore();
  const isOnline = getUserStatus(id);
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
          <div>
            <span>{username || "User"}</span>
          </div>
          {isOnline && (
            <span className="text-sm text-muted-foreground">Online</span>
          )}
        </div>
      </div>
    </div>
  );
};
