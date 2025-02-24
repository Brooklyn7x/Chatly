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
  loading,
}: UserListProps) => {
  if (users.length <= 0) {
    return <h1>No User Found.</h1>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }
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
