import { useUserStatus } from "@/hooks/useUserStatus";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserAvatarProps {
  url?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  userId?: any;
}

export const UserAvatar = ({
  url,
  size = "md",
  className,
  userId,
}: UserAvatarProps) => {
  const sizeClasses = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-lg",
    xl: "h-28 w-28 text-xl",
  };
  const { isOnline } = useUserStatus(userId || "");
  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage
        src={url || "https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka"}
        alt="Avatar"
        className="border rounded-full"
      />
      <AvatarFallback className={`font-medium ${sizeClasses[size]}`}>
        CN
      </AvatarFallback>
      {isOnline && (
        <span className="absolute bottom-1.5 right-0 h-2 w-2 bg-green-500 rounded-full" />
      )}
    </Avatar>
  );
};
