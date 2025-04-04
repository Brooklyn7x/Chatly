import { UserItem } from "../sidebar/UserItem";

interface UserListProps {
  users: any[];
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
      <div className="p-2 space-y-1">
        {users
          .filter((user) => user.id)
          .map((user, index) => (
            <div
              key={index}
              onClick={() => onUserToggle(user.id)}
              className="cursor-pointer border rounded-md"
            >
              <UserItem user={user} selected={selectedUserIds.has(user.id)} />
            </div>
          ))}
      </div>
    </div>
  );
};
