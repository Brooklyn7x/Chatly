import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  url?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  userId?: any;
  alt?: string;
}

const sizeConfig = {
  xs: { class: "h-6 w-6 text-xs", size: 24 },
  sm: { class: "h-8 w-8 text-sm", size: 32 },
  md: { class: "h-12 w-12 text-base", size: 48 },
  lg: { class: "h-16 w-16 text-lg", size: 64 },
  xl: { class: "h-28 w-28 text-xl", size: 112 },
};

export const UserAvatar = ({
  url,
  size = "md",
  className,
  alt,
}: UserAvatarProps) => {
  const { class: sizeClass } = sizeConfig[size];
  const defaultAvatar = "https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka";

  return (
    <div className={`relative ${sizeClass} ${className}`}>
      <Avatar className="h-full w-full">
        <AvatarImage
          src={url || defaultAvatar}
          alt={alt || "user-avatar"}
          className="border rounded-full object-cover"
          loading="lazy"
          sizes="50"
        />
        <AvatarFallback className={`font-medium ${sizeClass}`}>
          U
        </AvatarFallback>
      </Avatar>
    </div>
  );
};
