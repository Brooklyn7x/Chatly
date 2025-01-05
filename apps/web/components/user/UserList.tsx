import { User } from "@/types";
import { UserItem } from "../sidebar/UserItem";

interface UserListProps {
  users: User[];
  selectedUserIds: Set<string>;
  onUserToggle: (userId: string) => void;
  loading: boolean;
}

export const UserList = ({
  users,
  selectedUserIds,
  onUserToggle,
  loading,
}: UserListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-t pt-2 space-y-1">
        {users
          .filter((user) => user._id)
          .map((user) => (
            <div
              key={user._id}
              onClick={() => onUserToggle(user._id)}
              className="cursor-pointer"
            >
              <UserItem user={user} selected={selectedUserIds.has(user._id)} />
            </div>
          ))}
      </div>
    </div>
  );
};
