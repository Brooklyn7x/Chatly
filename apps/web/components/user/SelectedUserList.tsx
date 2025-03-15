import { User } from "@/types";
import { SelectedUser } from "./SelectedUser";

interface SelectUserListProps {
  users: any[];
}

export const SelectUserList = ({ users }: SelectUserListProps) => {
  if (!users) return;
  return (
    <div className="w-full mt-3 -mb-1">
      <div className="w-full flex gap-2 overflow-x-auto pb-2 scrollbar-none ">
        {users.map((user) => (
          <SelectedUser key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};
