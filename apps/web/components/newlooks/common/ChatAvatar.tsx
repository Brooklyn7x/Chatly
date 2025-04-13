import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/auth/useAuth";
import { generateAvatarUrl } from "@/lib/utils";
import useUserStatusStore from "@/store/useUserStatusStore";
import { Chat } from "@/types";

interface ChatAvatarProps {
  chat: Chat;
  className?: string;
  size?: "normal" | "large";
}

export const ChatAvatar = ({
  chat,
  className = "",
  size = "normal",
}: ChatAvatarProps) => {
  const { user } = useAuth();
  const { getUserStatus } = useUserStatusStore();

  const otherUser = chat?.participants.find((p) => p.userId.id !== user?._id);
  const otherUserId = otherUser?.userId?._id;
  const isOnline = getUserStatus(otherUserId || "");

  const fallbackName =
    chat?.participants
      .map((p) => p.userId.username[0]?.toUpperCase())
      .join("") || "CN";

  const avatarSrc =
    chat?.type === "group"
      ? generateAvatarUrl(fallbackName)
      : chat?.participants[0]?.userId.profilePicture;

  const sizeClass = size === "normal" ? "h-10 w-10" : "h-24 w-24";

  return (
    <span className={`relative overflow-hidden ${className}`}>
      <Avatar>
        <AvatarFallback>{fallbackName[0]}</AvatarFallback>
        <AvatarImage
          src={avatarSrc}
          alt={
            chat?.type === "group"
              ? chat.name || "Group"
              : chat?.participants[0]?.userId?.username || "User"
          }
          className={`rounded-full ${sizeClass} ${className}`}
        />
        {chat?.type === "private" && isOnline && (
          <div className="absolute h-2 w-2 rounded-full z-11 bg-green-400 bottom-1 right-1" />
        )}
      </Avatar>
    </span>
  );
};
