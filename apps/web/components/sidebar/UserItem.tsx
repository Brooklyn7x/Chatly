import { User } from "@/types";

interface UserItemProps {
  user: User;
}

export const UserItem = ({ user }: UserItemProps) => {
  return (
    <div className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50 transition-colors duration-200">
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
        <div className="font-semibold truncate">{user.username || 'User'}</div>
        <div className="text-muted-foreground text-sm truncate">
          Last message
        </div>
      </div>
    </div>
  );
};
