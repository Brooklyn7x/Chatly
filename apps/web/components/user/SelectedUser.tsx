import { User } from "@/types";

interface SelectedUserProps {
  user: User;
}

export const SelectedUser = ({ user }: SelectedUserProps) => {
  return (
    <div
      key={user._id}
      className="border bg-white/10 rounded-full overflow-hidden flex items-center"
    >
      <div className="relative flex-shrink-0 h-10 w-10">
        <img
          src={user.avatar || "/user.jpeg"}
          className="h-full w-full rounded-full object-cover"
          alt={user.name}
        />
      </div>

      <span className="text-sm p-2">{user.username}</span>
    </div>
  );
};
