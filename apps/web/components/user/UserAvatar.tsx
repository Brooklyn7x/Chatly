import { cn } from "@/lib/utils";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";

const avatarVariants = cva(
  "relative rounded-full overflow-hidden ring-2 ring-background",
  {
    variants: {
      size: {
        xs: "h-8 w-8",
        sm: "h-10 w-10",
        md: "h-12 w-12",
        lg: "h-14 w-14",
      },
      status: {
        online: "ring-2 ring-green-500",
        offline: "ring-2 ring-gray-500",
        none: "",
      },
      defaultVariants: {
        size: "md",
        status: "none",
      },
    },
  }
);

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
  imageUrl?: string | null;
  alt?: string;
  fallback?: string;
  className?: string;
  priority?: boolean;
}

export const UserAvatar = ({
  imageUrl,
  alt,
  fallback = "U",
  size,
  status,
  priority = false,
  className,
}: UserAvatarProps) => {
  const initials = fallback.substring(0, 2).toUpperCase();
  const imageSrc = imageUrl || "/user.png";
  return (
    <div className={cn(avatarVariants({ size, status }), className)}>
      <div className="relative w-full h-full">
        <Image
          src={imageSrc}
          alt={alt || "user avatar"}
          fill
          sizes={getSizes(size)}
          className={cn(
            "object-cover",
            "transition-opacity duration-300",
            "transform hover:scale-105 transition-transform"
          )}
          priority={priority}
          onError={(e) => {
            const imgElement = e.currentTarget as HTMLImageElement;
            imgElement.style.display = "none";
          }}
        />
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "bg-muted text-muted-foreground font-medium",
            "text-sm uppercase"
          )}
        >
          {initials}
        </div>
      </div>
    </div>
  );
};

function getSizes(size?: "xs" | "sm" | "md" | "lg" | null) {
  const sizes = {
    xs: "(max-width: 640px) 32px, 8vw",
    sm: "(max-width: 640px) 40px, 10vw",
    md: "(max-width: 640px) 48px, 12vw",
    lg: "(max-width: 640px) 56px, 14vw",
  };
  return sizes[size || "md"];
}
