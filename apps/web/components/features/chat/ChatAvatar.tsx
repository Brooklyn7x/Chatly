import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store/useAppStore";
import { Chat } from "@/types";

interface ChatAvatarProps {
  chat: Chat;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ChatAvatar = ({
  chat,
  size = "md",
  className,
}: ChatAvatarProps) => {
  const { user } = useAppStore();

  const getAvatarInfo = () => {
    if (chat.type === "group") {
      return {
        src: chat.avatar || "",
        fallback: chat.name?.charAt(0).toUpperCase() || "G",
        alt: chat.name || "Group Chat",
      };
    } else {
      // For private chats, show the other participant's avatar
      const otherParticipant = chat.participants?.find(
        (p) => p.userId._id !== user?.id && p.userId._id !== user?._id
      );

      if (otherParticipant) {
        return {
          src: otherParticipant.userId.avatar || "",
          fallback:
            otherParticipant.userId.username?.charAt(0).toUpperCase() || "U",
          alt: otherParticipant.userId.username || "User",
        };
      }

      return {
        src: "",
        fallback: "U",
        alt: "Unknown User",
      };
    }
  };

  const avatarInfo = getAvatarInfo();

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className || ""}`}>
      <AvatarImage src={avatarInfo.src} alt={avatarInfo.alt} />
      <AvatarFallback className="bg-primary/10 text-primary font-medium">
        {avatarInfo.fallback}
      </AvatarFallback>
    </Avatar>
  );
};
