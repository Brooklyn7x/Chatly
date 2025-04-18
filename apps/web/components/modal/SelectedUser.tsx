import { User } from "@/types";
import Image from "next/image";

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
        <Image
          src={user.profilePicture || "/user.png"}
          className="h-full w-full rounded-full object-cover"
          alt={user.username}
          fill
        />
      </div>

      <span className="text-sm p-2">{user.username}</span>
    </div>
  );
};
