import { User } from "@/types";
import { UserItem } from "../sidebar/UserItem";

interface UserListProps {
  users: User[];
  selectedUserIds: Set<string>;
  onUserToggle: (userId: string) => void;
  loading?: boolean;
}

export const UserList = ({
  users,
  selectedUserIds,
  onUserToggle,
}: UserListProps) => {
  return (
    <div className="h-full w-full">
      <div className="border-t p-2 space-y-1">
        {users
          .filter((user) => user.id)
          .map((user) => (
            <div
              key={user.id}
              onClick={() => onUserToggle(user.id)}
              className="cursor-pointer"
            >
              <UserItem user={user} selected={selectedUserIds.has(user.id)} />
            </div>
          ))}
      </div>
    </div>
  );
};
