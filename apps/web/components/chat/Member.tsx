import useUserStatusStore from "@/store/useUserStatusStore";
import { Participant } from "@/types";
import { UserAvatar } from "../shared/UserAvatar";
import { cn } from "@/lib/utils";

interface MemberProps {
  user: Participant;
  selected?: boolean;
}

export const Member = ({ user, selected }: MemberProps) => {
  const { id, username, profilePicture } = user.userId;
  const { role } = user;
  const { getUserStatus } = useUserStatusStore();
  const isOnline = getUserStatus(id);
  return (
    <div
      className={cn(
        "p-2 rounded-md cursor-pointer",
        "flex items-center gap-4 border",
        "hover:bg-muted/60 transition-colors duration-200",
        selected && "bg-muted/80"
      )}
    >
      <div className="relative flex-shrink-0 h-12 w-12">
        <UserAvatar size={"md"} url={profilePicture} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between font-semibold truncate">
          <div className="flex flex-col">
            <span className="font-bold">{username || "User"}</span>
            <span className="text-sm text-muted-foreground">{role}</span>
          </div>
          {isOnline && (
            <span className="text-sm font-mono text-muted-foreground">
              Online
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
