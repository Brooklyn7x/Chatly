import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserAvatarProps {
  url?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const UserAvatar = ({
  url,
  size = "md",
  className,
}: UserAvatarProps) => {
  const sizeClasses = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-lg",
    xl: "h-28 w-28 text-xl",
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage
        src={url || "https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka"}
        alt="Avatar"
        className="border rounded-full overflow-hidden"
      />
      <AvatarFallback className={`font-medium ${sizeClasses[size]}`}>
        CN
      </AvatarFallback>
    </Avatar>
  );
};
